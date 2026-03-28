// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
    /**
     * Ensure login page has email and password inputs
     */
    test('has email and password inputs', async ({ page }) => {
        // Mock check auth response
        await page.route('**/auth/me', route => route.fulfill({
            status: 401,
            contentType: 'application/json',
        }))

        const checkAuthPromise = page.waitForResponse('**/auth/me')

        await page.goto('/login')
        await checkAuthPromise
        await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
        await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible()
    })

    /**
     * Successful login must redirect user
     */
    test('redirect user when login successfully', async ({ page }) => {
        // Mock check auth response
        await page.route('**/auth/me', route => route.fulfill({
            status: 401,
            contentType: 'application/json',
        }))

        // Mock login response
        await page.route('**/auth/tokens', route => route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                plan: {
                    id: 1,
                    name: 'Free',
                    max_size: 1073741824,
                },
                profile: {
                    id: 1,
                    name: 'Test User',
                },
                role: 'user',
                token: 'mock-token',
                used_bytes: 0,
            })
        }))

        const checkAuthPromise = page.waitForResponse('**/auth/me')

        await page.goto('/login')
        await checkAuthPromise
        await page.getByRole('textbox', { name: /email/i }).fill('test@example.com')
        await page.getByRole('textbox', { name: /password/i }).fill('password')

        const loginPromise = page.waitForResponse('**/auth/tokens')

        await Promise.all([
            page.getByRole('button', { name: /log in/i }).click(),
            loginPromise,
        ])
        await expect(page).toHaveURL(/user\/recent/i, { timeout: 3000 })
    })

    /**
     * Redirect guest to login page when accessing userOnly routes during first load
     */
    test('redirect to login page when unauthenticated', async ({ page }) => {
        // Mock check auth response
        await page.route('**/auth/me', route => route.fulfill({
            status: 401,
            contentType: 'application/json',
        }))

        const checkAuthPromise = page.waitForResponse('**/auth/me')

        await page.goto('/user/recent')
        await checkAuthPromise
        await expect(page).toHaveURL(/login/i, { timeout: 3000 })
    })

    // /**
    //  * 
    //  */
    // test('', async ({ page }) => {})

    // /**
    //  * 
    //  */
    // test('', async ({ page }) => {})

    // /**
    //  * 
    //  */
    // test('', async ({ page }) => {})
})
