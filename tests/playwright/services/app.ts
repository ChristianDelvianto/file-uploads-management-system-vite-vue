import type { Page, Route } from '@playwright/test'
import { CSRF_COOKIE_URL_PATTERN } from '../const/app'

export async function mockCSRFCookieResponse(page: Page): Promise<void> {
    await page.route(CSRF_COOKIE_URL_PATTERN, (route: Route) => route.fulfill({
        status: 204,
        contentType: 'application/json'
    }))
}
