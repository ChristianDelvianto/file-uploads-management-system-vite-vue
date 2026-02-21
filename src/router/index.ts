import store from '@src/stores'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { Role } from '@src/types/user'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

/**
 * Navigation guard
 */
router.beforeEach((to, from) => {
    const isAuthenticated: boolean = store.getters['auth/authenticated']
    const isLoggedOut: boolean = store.getters['auth/loggedOut']
    const userRole: Role = store.getters['auth/profile']?.role ?? 'user'

    // Initial visit
    if (!from.name) {
        return true
    }

    // Guest tries to visit userOnly routes
    if (!isAuthenticated && to.meta.userOnly) {
        if (from.name === 'login') {
            return false
        }

        return {
            name: 'login',
        }
    }

    // User tries to visit guestOnly routes
    if (isAuthenticated && to.meta.guestOnly) {
        // Exception; user wants to log out
        if (isLoggedOut && to.name === 'login') {
            return true
        }

        return {
            name: `${userRole}.dashboard`,
        }
    }

    // Role mismatch
    if (isAuthenticated && (to.meta.role && to.meta.role !== userRole)) {
        return {
            name: `${userRole}.dashboard`,
        }
    }

    return true
})

router.afterEach((to, from, failure): void => {
    if (failure) {
        console.warn('Navigation error:', failure)
    }
})

export default router
