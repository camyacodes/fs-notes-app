import { render, screen } from '@testing-library/react'
// makes simulating user input a bit easier
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('Togglable Component', async () => {
  let container
  // The beforeEach function gets called before each test,
  //   which then renders the Togglable component and saves the field container of the returned value
  beforeEach(() => {
    container = render(
      <Togglable buttonLabel='show..'>
        <div className='testDiv'>togglable content</div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', async () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display:none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show..')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show..')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
