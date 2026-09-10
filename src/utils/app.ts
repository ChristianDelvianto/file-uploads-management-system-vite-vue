/**
 * Check if browser cookie enabled.
 */
export function isCookieEnabled(): boolean {
    return navigator.cookieEnabled
}

/**
 * Show alert that the feature not in development scope.
 */
export function notInDevelopmentScope() {
    window.alert('Not in development scope')
}
