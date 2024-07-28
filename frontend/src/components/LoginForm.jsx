/* eslint-disable react/prop-types */
import { useState } from 'react'
import PropTypes from 'prop-types'
const LoginForm = ({ handleSubmit }) => {
  // lifted up state to this component bc it only needs these variables
  const [username, setUsername] = useState('') // Username input for login
  const [password, setPassword] = useState('') // Password input for login
  // pass the state variables to login event event handler that was passed
  // into this component as a prop
  const handleLogin = (event) => {
    event.preventDefault()
    handleSubmit(username, password)
    // reset form
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='text'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

LoginForm.proptypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm
