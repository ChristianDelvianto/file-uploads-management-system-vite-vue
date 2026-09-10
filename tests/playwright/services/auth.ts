import type { Page, Route } from '@playwright/test'
import {
    CHECK_AUTH_API_RESPONSE,
    CHECK_AUTH_API_URL_PATTERN,
    LOGIN_API_RESPONSE,
    LOGIN_API_URL_PATTERN
} from '../const/auth'

export async function mockCheckAuthResponse(page: Page): Promise<void> {
    await page.route(CHECK_AUTH_API_URL_PATTERN, (route: Route) => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(CHECK_AUTH_API_RESPONSE)
    }))
}

export async function mockLoginResponse(page: Page): Promise<void> {
    await page.route(LOGIN_API_URL_PATTERN, (route: Route) => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(LOGIN_API_RESPONSE)
    }))
}

export async function mockSignupResponse(page: Page): Promise<void> {
    // await page.route()
}
