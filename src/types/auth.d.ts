import { Role, User } from '@src/types/user'
import { PlanUser } from './plan'

export interface ModuleState {
    authenticated: boolean,
    logged_out: boolean,
    profile: User | null,
    role: Role,
    used_bytes: number,

    // Plan
    plan_id: number,
    plan_limit_bytes: number,
    plan_name: string
}

export interface CheckAuthResponse {
    plan?: PlanUser, // For 'user'
    profile: User,
    role: Role,
    used_bytes?: number // For 'user'
}

export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse {
    plan?: PlanUser, // For 'user'
    profile: User,
    role: Role,
    token: string,
    used_bytes?: number // For 'user'
}

export interface SignupRequest {
    name: string,
    email: string,
    password: string,
    password_confirmation: string
}

export interface SignupResponse extends LoginResponse {}
