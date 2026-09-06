import {
    createAccount,
    getAccountInfo,
    login,
    logout
} from '@/services/auth.service'
import {
    CheckAuthResponse,
    LoginRequest,
    LoginResponse,
    ModuleState,
    SignupRequest
} from '@/types/auth'
import { ActionContext } from 'vuex/types/index.js'

/**
 * Check authentication and get user's profile data.
 */
async function check(context: ActionContext<ModuleState, {}>): Promise<CheckAuthResponse> {
    const data = await getAccountInfo()

    context.commit('AUTHENTICATED', data)
}

/**
 * Issue new token and get user's profile data.
 */
async function loginAttempt(context: ActionContext<ModuleState, {}>, payload: LoginRequest): Promise<LoginResponse> {
    const data = await login(payload)

    context.commit('AUTHENTICATED', data)
}

/**
 * Log out from the application.
 */
export async function logoutUser(context: ActionContext<ModuleState, {}>): void {
    await logout()

    context.commit('LOG_OUT')
}

/**
 * Set logged_out as true.
 */
async function loggedOut(context: ActionContext<ModuleState, {}>): Promise<void> {
    context.commit('LOGGED_OUT')
}

/**
 * Create new account.
 */
async function signup(context: ActionContext<ModuleState, {}>, payload: SignupRequest): Promise<void> {
    const data = await createAccount(payload)

    context.commit('AUTHENTICATED', data)
}

export default {
    check,
    loginAttempt,
    logoutUser,
    loggedOut,
    signup
}
