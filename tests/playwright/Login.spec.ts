// @ts-check
import { test, expect } from '@playwright/test'
import { CHECK_AUTH_API_URL_PATTERN } from './const/auth'
import { HOME_USER_URL, LOGIN_URL } from './const/route'
import { mockLoginResponse } from './services/auth'
import { mockCSRFCookieResponse } from './services/app'
import { mockUnauthenticatedResponse } from './services/error'

test.describe('Login page', () => {
    /**
     * Ensure page has email and password inputs
     * 
     * User flow:
     * 1. User opens the app and entered login route
     * 2. User sees email and password inputs
     */
    test('has email and password inputs', async ({ page }) => {
        await mockUnauthenticatedResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(LOGIN_URL)

        await expect(page).toHaveURL(LOGIN_URL)
        await expect(page.getByTestId(/email/)).toBeVisible()
        await expect(page.getByTestId(/password/)).toBeVisible()
    })

    /**
     * Successful login must redirect user
     * 
     * User flow:
     * 1. User opens the app and entered login route
     * 2. User sees email and password inputs
     * 3. User fills email and password inputs and submit
     * 4. User is redirected to home route
     */
    test('redirect user when login successfully', async ({ page }) => {
        await mockCSRFCookieResponse(page)
        await mockUnauthenticatedResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(LOGIN_URL)

        await mockLoginResponse(page)

        await expect(page).toHaveURL(LOGIN_URL)
        await expect(page.getByTestId(/email/)).toBeVisible()
        await expect(page.getByTestId(/password/)).toBeVisible()

        await page.getByTestId(/email/).fill('test@example.com')
        await page.getByTestId(/password/).fill('password')
        await page.getByTestId(/submit/).click()

        await expect(page).toHaveURL(HOME_USER_URL)
    })
})
