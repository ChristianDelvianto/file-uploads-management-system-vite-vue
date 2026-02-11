import { StoreState } from './types'

const state: StoreState = {
    authenticated: false,
    loggedOut: false,
    profile: null,
    role: 'user', // default
}

export default state
