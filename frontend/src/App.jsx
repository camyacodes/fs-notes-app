import { useState, useEffect } from "react";
import axios from "axios";
import noteService from "./services/notes";
import Note from "./components/Note";
import Notification from "./components/Notification";

const App = () => {
  const [noteArr, setNotesArr] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    // console.log("effect");
    noteService.getAll().then((initialNotes) => {
      setNotesArr(initialNotes);
    });
  }, []);

  // console.log("render", noteArr.length, "notes");

  const notesToShow = showAll
    ? noteArr
    : noteArr.filter((note) => note.important);

  const addNote = (event) => {
    event.preventDefault();
    // console.log("button clicked", event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    // Add success msg
    noteService.create(noteObject).then((returnedNote) => {
      setNotesArr(noteArr.concat(returnedNote));
      setNewNote("");
      setType("Added");
      setMessage(`Added "${returnedNote.content}"`);
      setTimeout(() => {
        setMessage(null);
        setType(null);
      }, 5000);
    }).catch(error => {
      setType("Error");
      setMessage(`${error.response.data.error}"`);
      setTimeout(() => {
        setMessage(null);
        setType(null);
      }, 5000);
    })
  };

  const handleNoteChange = (event) => {
    // console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = noteArr.find((n) => n.id === id);
    const changeNote = { ...note, important: !note.important };
    // add success message
    noteService
      .update(id, changeNote)
      .then((returnedNote) => {
        setNotesArr(noteArr.map((n) => (n.id !== id ? n : returnedNote)));
      })
      .catch((error) => {
        setType("Error");
        setMessage(`Note "${note.content}" was already removed from server`);
        setTimeout(() => {
          setMessage(null);
          setType(null);
        }, 5000);
        setNotesArr(noteArr.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} type={type} />
      <button
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        show {showAll ? "important" : "all"}
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
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
