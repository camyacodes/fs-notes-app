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

  // Fetch all notes when component mounts
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotesArr(initialNotes)
    })
  }, [])

  // Check for logged-in user in localStorage when component mounts
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // Notes to be displayed based on the showAll state
  const notesToShow = showAll
    ? noteArr
    : noteArr.filter((note) => note.important)

  // Function to add a new note
  const addNote = (noteObject) => {
    event.preventDefault()
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotesArr(noteArr.concat(returnedNote))
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
    const note = noteArr.find((n) => n.id === id)
    const changeNote = { ...note, important: !note.important }
    noteService
      .update(id, changeNote)
      .then((returnedNote) => {
        setNotesArr(noteArr.map((n) => (n.id !== id ? n : returnedNote)))
      })
      .catch((exception) => {
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

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
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

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
