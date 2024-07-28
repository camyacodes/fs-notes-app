import { render, screen } from '@testing-library/react'
// makes simulating user input a bit easier
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'

test('NoteForm comp updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a  form...')
  await user.click(sendButton)

  //   ensures that submitting the form calls the createNote method
  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a  form...')
})

// Test coverage
// We can easily find out the coverage of our tests by running them with the command.

// npm test -- --coveragecopy
// The first time you run the command, Vitest will ask you if you want to install the required library @vitest/coverage-v8. Install it, and run the command again:

// A HTML report will be generated to the coverage directory. The report will tell us the lines of untested code in each component:
