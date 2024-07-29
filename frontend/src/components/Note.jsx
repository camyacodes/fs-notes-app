/* eslint-disable react/prop-types */

const Note = ({ note, toggleImportance }) => {
  // if important field on note is true, label the button to make it not importance vice versa
  const label = note.important ? 'make not important' : 'make Important'
  return (
    <li className='note'>
      {note.content}&ensp;
      <button onClick={toggleImportance}> {label}</button>
    </li>
  )
}

export default Note
