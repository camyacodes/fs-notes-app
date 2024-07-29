const { test, expect } = require('@playwright/test')
const { connectDB, dropDB, dropCollections } = require('../utils/config')
const Note = require('../../models/note')
const User = require('../../models/user')

// test.beforeAll(async () => {
//   await connectDB()
// })

// test.afterAll(async () => {
//   await dropDB()
// })

// test.afterEach(async () => {
//   await dropCollections()
// })

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen',
      },
    })

    // opens the application
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    // locators represent a way to find element(s) on the page at any moment.
    const locator = await page.getByText('Notes')

    //   ensures that the element corresponding to the locator is visible at the page.
    await expect(locator).toBeVisible()

    await expect(page.getByText('Note App, camyacodes, 2024')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    // Pressing the button is performed using the Locator method click
    await page.getByRole('button', { name: 'login' }).click()

    // After writing in the text fields,
    await page.getByTestId('username').fill('root')
    await page.getByTestId('password').fill('salainen')

    // the test presses the login button
    await page.getByRole('button', { name: 'login' }).click()

    // and checks that the application renders the logged-in user's information on the screen
    await expect(page.getByText('Superuser Logged-in')).toBeVisible()
  })

  test.describe('when logged in', () => {
    // user is logged in
    test.beforeEach(async ({ page }) => {
      // Pressing the button is performed using the Locator method click
      await page.getByRole('button', { name: 'login' }).click()

      // After writing in the text fields,
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('salainen')

      // the test presses the login button
      await page.getByRole('button', { name: 'login' }).click()
    })
    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(
        page.locator('li:has-text("a note created by playwright")')
      ).toBeVisible()
    })
  })
})
