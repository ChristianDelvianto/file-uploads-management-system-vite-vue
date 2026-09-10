import type { Page, Route } from '@playwright/test'
import {
    INVALID_CSRF_RESPONSE,
    NOT_FOUND_RESPONSE,
    SERVER_ERROR_RESPONSE,
    SERVICE_UNAVAILABLE_RESPONSE,
    TOO_MANY_REQUEST_RESPONSE,
    UNAUTHENTICATED_RESPONSE,
    UNAUTHORIZED_RESPONSE
} from '../const/error'

/**
 * Error for 404
 */
export async function mockNotFoundResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify(NOT_FOUND_RESPONSE)
    }))
}

/**
 * Error for 419
 */
export async function mockInvalidCSRFCookieResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 419,
        contentType: 'application/json',
        body: JSON.stringify(INVALID_CSRF_RESPONSE)
    }))
}

/**
 * Error for 500
 */
export async function mockServerErrorResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify(SERVER_ERROR_RESPONSE)
    }))
}

/**
 * Error for 503
 */
export async function mockServiceUnavailableResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify(SERVICE_UNAVAILABLE_RESPONSE)
    }))
}

/**
 * Error for 422
 */
export async function mockInvalidValidationResponse(page: Page, urlPattern: string, validationResponse: object): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify(validationResponse)
    }))
}

/**
 * Error for 429
 */
export async function mockTooManyRequestsResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify(TOO_MANY_REQUEST_RESPONSE)
    }))
}

/**
 * Error for 403
 */
export async function mockUnauthorizedResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify(UNAUTHORIZED_RESPONSE)
    }))
}

/**
 * Error for 401
 */
export async function mockUnauthenticatedResponse(page: Page, urlPattern: string): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify(UNAUTHENTICATED_RESPONSE)
    }))
}