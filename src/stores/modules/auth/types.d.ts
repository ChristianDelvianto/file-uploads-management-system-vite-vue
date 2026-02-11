import { User, Role } from '@src/types/user'

export interface StoreState {
    authenticated: boolean,
    loggedOut: boolean,
    profile: User | null,
    role: Role,
}

export interface CheckAuthResponse {
    profile: User,
    role: Role,
}

export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    profile: User,
    role: Role,
    token: string,
}

export interface SignupRequest {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
}

export interface SignupResponse extends LoginResponse {}
