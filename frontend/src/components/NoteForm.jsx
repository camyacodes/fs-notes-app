/* eslint-disable react/prop-types */
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  // state is seperated because you only need it for this part note creation
  const [newNote, setNewNote] = useState('')

  // on submit call create note function prop and reset note state after
  const addNote = (event) => {
    event.preventDefault()
    // create note is the original add note function added as a prop (See App.jsx)
    createNote({
      content: newNote,
      important: true,
    })

    setNewNote('')
  }

  return (
    <div className='formDiv'>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          //  controlled component, where the value of the input(UI as well)is controlled by the component's state.
          value={newNote}
          // As the user types and changes the input, the state is updated and reflected in the UI through the value
          onChange={(event) => setNewNote(event.target.value)}
          placeholder='write note content here'
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default NoteForm
