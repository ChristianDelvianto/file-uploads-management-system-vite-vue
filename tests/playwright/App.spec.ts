// @ts-check
import { test, expect } from '@playwright/test'
import { CHECK_AUTH_API_URL_PATTERN } from './const/auth'
import { LOGIN_URL, HOME_USER_URL } from './const/route'
import { mockCheckAuthResponse } from './services/auth'
import {
    mockServerErrorResponse,
    mockServiceUnavailableResponse,
    mockUnauthenticatedResponse
} from './services/error'

test.describe('App component', () => {
    /**
     * Disabled browser cookie should render page error component
     * 
     * User flow:
     * 1. User opens the app and entered home route
     * 2. Browser has disabled cookie
     * 3. User sees page error component with retry button
     */
    test('render page error component when browser cookie is disabled', async ({ browser }) => {
        const context = await browser.newContext()

        await context.addInitScript(() => {
            Object.defineProperty(
                Object.getPrototypeOf(navigator), 'cookieEnabled', { value: false }
            )
        })

        const pageWithDisabledCookie = await context.newPage()

        await pageWithDisabledCookie.goto(HOME_USER_URL)

        await expect(pageWithDisabledCookie.getByTestId('page-error')).toBeVisible()
        await expect(pageWithDisabledCookie.getByTestId('page-error-retry-button')).toBeVisible()
    })

    /**
     * Redirect guest to login page when accessing userOnly
     * 
     * User flow:
     * 1. No cookie in browser and user is not authenticated
     * 2. User entered home route
     * 3. App redirect to login route
     */
    test('redirect to login page when unauthenticated', async ({ page }) => {
        await mockUnauthenticatedResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(HOME_USER_URL)

        await expect(page).toHaveURL(LOGIN_URL)
    })

    /**
     * User must not able to access guestOnly route when already authenticated
     * 
     * User flow:
     * 1. User opens the app and entered login route
     * 3. Account or Auth checks successfully and user is authenticated
     * 4. App redirects to home route
     */
    test('redirect to home page when accessing guestOnly route', async ({ page }) => {
        await mockCheckAuthResponse(page)

        await page.goto(LOGIN_URL)

        await expect(page).toHaveURL(HOME_USER_URL)
    })

    /**
     * Server error render page error component
     * 
     * User flow:
     * 1. Browser has auth token
     * 2. User "reopens" the app and entered home route
     * 3. Account / Auth checks return server error (500)
     * 4. User sees page error component with retry button
     */
    test('render page error component when having server error (500) response', async ({ page }) => {
        await mockServerErrorResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(HOME_USER_URL)

        await expect(page.getByTestId('page-error')).toBeVisible()
        await expect(page.getByTestId('page-error-retry-button')).toBeVisible()
    })

    /**
     * Unavailable service render page error component
     * 
     * User flow:
     * 1. User opens the app and entered home route
     * 3. Account / Auth checks return service unavailable error (503)
     * 4. User sees page error component with retry button
     */
    test('render page error component when having service unavailable error (503) response', async ({ page }) => {
        await mockServiceUnavailableResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(HOME_USER_URL)

        await expect(page.getByTestId('page-error')).toBeVisible()
        await expect(page.getByTestId('page-error-retry-button')).toBeVisible()
    })

    /**
     * Retry attempt successful and page error should disappear
     * 
     * User flow:
     * 1. User opens the app and entered home route
     * 3. Account / Auth checks return service unavailable error (503)
     * 4. User sees page error component with retry button
     * 5. User click retry button
     * 6. Page error component switch to RouterView
     */
    test('page error disappear when retry attempt successful', async ({ page }) => {
        await mockServiceUnavailableResponse(page, CHECK_AUTH_API_URL_PATTERN)

        await page.goto(HOME_USER_URL)

        await mockCheckAuthResponse(page)

        await page.getByTestId('page-error-retry-button').click()

        await expect(page.getByTestId('page-error')).toBeHidden()
    })
})