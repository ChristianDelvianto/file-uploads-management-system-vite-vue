import { ModuleState } from '@/types/auth'

export default {
    authenticated: (state: ModuleState) => state.authenticated,
    logged_out: (state: ModuleState) => state.logged_out,
    profile: (state: ModuleState) => state.profile,
    used_bytes: (state: ModuleState) => state.used_bytes,

    // Plan
    plan_id: (state: ModuleState) => state.plan_id,
    plan_limit_bytes: (state: ModuleState) => state.plan_limit_bytes,
    plan_name: (state: ModuleState) => state.plan_name
}
