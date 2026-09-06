import { ModuleState } from '@/types/auth'
import { PlanUser } from '@/types/plan'
import { User } from '@/types/user'

/**
 * Mark the user as authenticated and store user's profile data.
 */
function AUTHENTICATED(
    state: ModuleState,
    payload: {
        plan: PlanUser,
        profile: User,
        used_bytes: number
    }
): void {
    state.authenticated = true
    state.logged_out = false
    state.profile = payload.profile
    state.used_bytes = payload.used_bytes

    state.plan_id = payload.plan.id
    state.plan_limit_bytes = payload.plan.limit_bytes
    state.plan_name = payload.plan.name
}

/**
 * Mark the user logged out.
 */
function LOG_OUT(state: ModuleState): void {
    state.logged_out = true
}

/**
 * User logged out and reset store state.
 */
function LOGGED_OUT(state: ModuleState): void {
    state.authenticated = false
    state.logged_out = false
    state.profile = null
    state.used_bytes = 0
    
    state.plan_id = 1
    state.plan_limit_bytes = 0
    state.plan_name = 'Free'
}

/**
 * Update user's `used_bytes`
 */
function SET_USED_BYTES(state: ModuleState, value: number): void {
    state.used_bytes = value
}

export default {
    AUTHENTICATED,
    LOG_OUT,
    LOGGED_OUT,
    SET_USED_BYTES
}
