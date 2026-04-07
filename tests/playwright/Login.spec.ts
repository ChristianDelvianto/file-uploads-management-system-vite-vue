// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
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

        await Promise.all([
            page.goto('/user/home'),
            checkAuthPromise,
        ])
        await expect(page).toHaveURL(/login/i)
    })

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

        await Promise.all([
            page.goto('/login'),
            checkAuthPromise,
        ])
        await expect(page).toHaveURL(/login/i)
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
                    max_size: 536870912, // 512 Mb
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

        await Promise.all([
            page.goto('/login'),
            checkAuthPromise,
        ])
        await page.getByRole('textbox', { name: /email/i }).fill('test@example.com')
        await page.getByRole('textbox', { name: /password/i }).fill('password')

        const loginPromise = page.waitForResponse('**/auth/tokens')

        await Promise.all([
            page.getByRole('button', { name: /log in/i }).click(),
            loginPromise,
        ])
        await expect(page).toHaveURL(/user\/home/i)
    })
})
