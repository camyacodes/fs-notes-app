/* eslint-disable react/prop-types */
import { useState } from 'react'

const Togglable = (props) => {
  // visible state only needs to be used by this component so its seperated
  const [visible, setVisible] = useState(false)

  // these effect the inline style to either show or hide the childe component
  // Creates an object hideWhenVisible with a display style property that is set to 'none' when visible is true,
  // otherwise it's an empty string (showing the element)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  // Creates an object showWhenVisible with a display style property that is set to an empty string when visible is true,
  // otherwise it's 'none' (hiding the element).
  const showWhenVisible = { display: visible ? '' : 'none' }

  // toggle visibiliy on or off and change state to reflect it true or false
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {/* for example newNote button of note form */}
      {/*  originally it shows because is false and so there is not display line arg*/}
      <div style={hideWhenVisible}>
        {/* once clicked visibility for noteform is true, hiding the button */}
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      {/* the form is originally hidden bc visibility is false */}
      <div style={showWhenVisible}>
        {props.children}
        {/* cancel button is revealed from visibility is true and form is revealed*/}
        {/* when clicked visibility goes back to false and form is hidden */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
