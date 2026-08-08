import store from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * Navigation guard
 */
router.beforeEach(function (to, from) {
    const isAuthenticated: boolean = store.getters['auth/authenticated']
    const isLoggedOut: boolean = store.getters['auth/logged_out']

    // Initial visits
    if (!from.name) {
        return true
    }

    // Guest tries to visit userOnly routes
    if (!isAuthenticated && to.meta.userOnly) {
        if (from.name === 'login') {
            return false
        }

        return {
            name: 'login'
        }
    }

    // User tries to visit guestOnly routes
    if (isAuthenticated && to.meta.guestOnly) {
        // Exception; user wants to log out
        if (isLoggedOut && to.name === 'login') {
            return true
        }

        return {
            name: 'user.dashboard'
        }
    }

    return true
})

router.afterEach(function (to, from, failure): void {
    if (failure) {
        console.warn('Navigation error:', failure)
    }
})

export default router
