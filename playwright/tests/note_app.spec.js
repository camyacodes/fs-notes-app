const { loginWith, createNote } = require('./helper')
const { test, expect } = require('@playwright/test')

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    // testing of the backend always starts from the same state
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen',
      },
    })

    // opens the application
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    // locators represent a way to find element(s) on the page at any moment.
    const locator = await page.getByText('Notes')

    //   ensures that the element corresponding to the locator is visible at the page.
    await expect(locator).toBeVisible()

    await expect(page.getByText('Note App, camyacodes, 2024')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    // Colors must be defined to Playwright as rgb codes
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    // ensures that the application does not render the text describing a successful login
    await expect(page.getByText('Superuser Logged-in')).not.toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'root', 'salainen')

    // and checks that the application renders the logged-in user's information on the screen
    await expect(page.getByText('Superuser Logged-in')).toBeVisible()
  })

  test.describe('when logged in', () => {
    // user is logged in
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
    })
    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright', true)

      await expect(
        page.locator('li:has-text("a note created by playwright")')
      ).toBeVisible()
    })
    test.describe('and several note exists', () => {
      // In the following, we first look for a note and click on its button that has text make not important.
      // After this, we check that the note contains the button with make important.
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = page
          .locator('li')
          .filter({ hasText: 'third note' })
          .getByRole('button')
        const otherdNoteElement = otherNoteText.locator('..')

        await otherdNoteElement
          .getByRole('button', { name: 'make not important' })
          .click()
        await expect(
          otherdNoteElement.getByText('make important')
        ).toBeVisible()
      })
    })
  })
})
