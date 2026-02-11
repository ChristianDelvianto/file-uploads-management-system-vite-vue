import Api from './index'
import {
    CheckAuthResponse,
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
} from '@src/stores/modules/auth/types'

/**
 * 
 */
export const getAccountInfo = async (): Promise<CheckAuthResponse> => {
    const res = await Api.get('/auth/me')

    return res.data
}

/**
 * 
 */
export const issueNewToken = async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await Api.post('/auth/login', payload)

    return res.data
}

/**
 * 
 */
export const createAccount = async (payload: SignupRequest): Promise<SignupResponse> => {
    const res = await Api.post('/auth/new', payload)

    return res.data
}

/**
 * 
 */
export const revokeCurrentToken = async (): Promise<void> => {
    Api.delete('/auth/tokens/revoke')
}
