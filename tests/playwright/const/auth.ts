export const CHECK_AUTH_API_URL_PATTERN = '**/auth/account'

export const CHECK_AUTH_API_RESPONSE = {
    plan: {
        id: 1,
        name: 'Free',
        limit_bytes: 536870912 // 512 Mb
    },
    profile: {
        id: 1,
        photo: null,
        name: 'Test User'
    },
    used_bytes: 0
}

export const LOGIN_API_URL_PATTERN = '**/auth/login'

export const LOGIN_API_RESPONSE = {
    ...CHECK_AUTH_API_RESPONSE
}

export const SIGNUP_API_URL_PATTERN = '**/auth/signup'
