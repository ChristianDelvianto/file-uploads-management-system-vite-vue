import LoginPage from '@/pages/Login.vue'
import SignupPage from '@/pages/Signup.vue'
import type { RouteRecordRaw } from 'vue-router'

const login: RouteRecordRaw = {
    meta: {
        guestOnly: true,
        userOnly: false,
        role: null,
    },
    path: '/login',
    name: 'login',
    component: LoginPage
}

const signup: RouteRecordRaw = {
    meta: {
        guestOnly: true,
        userOnly: false,
        role: null,
    },
    path: '/signup',
    name: 'signup',
    component: SignupPage
}

export default [
    login,
    signup
]