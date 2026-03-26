// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/auth/me', route => route.fulfill({
            status: 401,
            contentType: 'application/json',
        }))

        const responsePromise = page.waitForResponse('**/auth/me')

        await page.goto('/login')
        await responsePromise
    })

    test('has email and password inputs', async ({ page }) => {
        await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
        await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible()
    })

    test('redirect user when login successfully', async ({ page }) => {
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

        await page.getByRole('textbox', { name: /email/i }).fill('test@example.com')
        await page.getByRole('textbox', { name: /password/i }).fill('password')

        const responsePromise = page.waitForResponse('**/auth/tokens')

        await Promise.all([
            page.getByRole('button', { name: /log in/i }).click(),
            responsePromise,
        ])
        await expect(page).toHaveURL(/user\/recent/i, { timeout: 3000 })
    })
})
