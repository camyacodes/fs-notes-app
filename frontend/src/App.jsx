import { useState, useEffect } from 'react'
import noteService from './services/notes' // Service for handling notes API requests
import loginService from './services/login' // Service for handling login API requests
import Note from './components/Note' // Component to display individual notes
import Notification from './components/Notification' // Component to display notifications
import LoginForm from './components/LoginForm' // Component for the login form
import Togglable from './components/Togglable' // Component for toggling visibility of child components
import NoteForm from './components/NoteForm' // Component for adding new notes

const App = () => {
  // State variables
  const [noteArr, setNotesArr] = useState([]) // Array to store notes
  const [showAll, setShowAll] = useState(true) // Boolean to control visibility of all or important notes
  const [message, setMessage] = useState(null) // Notification message
  const [type, setType] = useState(null) // Type of notification (success or error)
  const [username, setUsername] = useState('') // Username input for login
  const [password, setPassword] = useState('') // Password input for login
  const [user, setUser] = useState(null) // Logged-in user information

  // Fetch all notes when component mounts or page refreshes or react app restarts
  // useEffect lets you run some code after rendering so that you can synchronize your component with some system outside of React.
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotesArr(initialNotes)
    })
  }, [])

  // THEN Check for logged-in user in localStorage when component mounts
  // You use useEffect here because you need to sync your app with localstorage which is an "external system"
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // Notes to be displayed based on the showAll state
  // use ternary operator: if show all is true show all notes otherwise filter out important ones
  const notesToShow = showAll
    ? noteArr
    : noteArr.filter((note) => note.important)

  // Function to add a new note
  const addNote = (noteObject) => {
    // prevent automatic reload
    event.preventDefault()
    // send post request to backend api using service
    // noteObject comes from NoteForm component
    noteService
      .create(noteObject)
      // get response back which is created note
      .then((returnedNote) => {
        // Add to the notes Arr
        setNotesArr(noteArr.concat(returnedNote))
        // Log sucess message for 5 secs
        setType('Added')
        setMessage(`Added "${returnedNote.content}"`)
        setTimeout(() => {
          setMessage(null)
          setType(null)
        }, 5000)
      })
      .catch((error) => {
        setType('Error')
        setMessage(`${error.response.data.error}"`)
        setTimeout(() => {
          setMessage(null)
          setType(null)
        }, 5000)
      })
  }

  // Function to toggle the importance of a note
  const toggleImportanceOf = (id) => {
    // using it's id, find the note in the bigger noteArr
    const note = noteArr.find((n) => n.id === id)
    // create a new version of the note (spread operator: make shallow copy then overwrite specific property) and changing importance
    const changeNote = { ...note, important: !note.important }
    // update note sending put req through service
    noteService
      .update(id, changeNote)
      // get returned updated note then update noteArr
      .then((returnedNote) => {
        // for each note in the arr, if the id does not match changed note id, just return it otherwise replace note with returnedNote
        setNotesArr(noteArr.map((n) => (n.id !== id ? n : returnedNote)))
      })
      // eslint-disable-next-line no-unused-vars
      .catch((exception) => {
        // If there is an error, it is because the note does not exist
        setType('Error')
        setMessage(`Note "${note.content}" was already removed from server`)
        setTimeout(() => {
          setMessage(null)
          setType(null)
        }, 5000)
        setNotesArr(noteArr.filter((n) => n.id !== id))
      })
  }

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault()
    // login user using login service that sends post req to backend login route
    try {
      // get user that is sent back with response
      const user = await loginService.login({ username, password })
      // set it to local storage so that token session is saved and a refresh does not log the user out
      // use JSON.stringify to convert JavaScript objects to strings for local storage, and JSON.parse to convert them back to objects when retrieving.
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      // use service to set token for the App while the user is logged in.
      // This will attach the token to the post request made by user that is need to verify the req and to make sure the created note goes with specific user
      noteService.setToken(user.token)
      // set the user as the user for the state
      setUser(user)
      // reset form
      setUsername('')
      setPassword('')
    } catch (exception) {
      setType('Error')
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  // Function to render the login form
  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  // Function to render the note form
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} type={type} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h3>{user.name} Logged-in</h3>
          {noteForm()}
        </div>
      )}
      {/* button to show important notes. reverses showall state on click and that results in show notes arr being updated */}
      <button onClick={() => setShowAll(!showAll)}>
        {/* if show all is true then you want the button to say show important and vice versa */}
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {/* map each note to its own note component */}
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            // The reason for formatting the toggleImportance prop as a callback function () => toggleImportanceOf(note.id) instead of directly using toggleImportanceOf(note.id) is to ensure that the function is passed as a prop, not its return value.
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
