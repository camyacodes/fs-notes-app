import { render, screen } from '@testing-library/react'
// makes simulating user input a bit easier
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }
  //   create a Note componenet in the testing env
  render(<Note note={note} />)

  //   We can use the object screen to access the rendered component.
  //   We use screen's method getByText to search for an element that has the note content and ensure that it exists
  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  )

  //   tests whether the element exists
  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  //   create a mock function
  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler} />)

  //   A session is started to interact with the rendered component
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
