const loginWith = async (page, username, password) => {
  // Pressing the button is performed using the Locator method click
  await page.getByRole('button', { name: 'login' }).click()

  // After writing in the text fields,
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)

  // the test presses the login button
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  //    "slowing down" the insert operations
  //   by using the waitFor command after the insert to wait for the inserted note to render
  await page.locator(`li:has-text("${content}")`).waitFor()
}

export { loginWith, createNote }
