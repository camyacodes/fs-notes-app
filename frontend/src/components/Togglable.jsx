/* eslint-disable react/prop-types */
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  // visible state only needs to be used by this component so its seperated
  const [visible, setVisible] = useState(false)

  // Style objects to show/hide elements based on visibility state
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

  // expose the toggle visibility function to the parent component so it can be used there
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      {/* for example newNote button of note form */}
      {/*  originally it shows because visibility is false and so there is no display line arg*/}
      <div style={hideWhenVisible}>
        {/* once clicked visibility for noteform is true, hiding the button... */}
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      {/* AND showing the form */}
      {/* the form is originally hidden bc visibility is false */}
      <div style={showWhenVisible}>
        {props.children}
        {/* cancel button is revealed from visibility is true and form is revealed*/}
        {/* when clicked visibility goes back to false and form is hidden */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

// The eslint rule react/display-name requires that components have a display name.
// This is particularly important for debugging and developer tools, as it helps to identify components.
// When you use forwardRef, the component is wrapped, and the resulting component does not have a display name by default.

Togglable.displayName = 'Togglable'

export default Togglable
