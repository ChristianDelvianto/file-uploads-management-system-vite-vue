import store from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

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
    const userRole = 'user'

    // Initial visit
    if (!from.name) {
        return true
    }

    // Guest tries to visit userOnly routes
    if (!isAuthenticated && to.meta.userOnly) {
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
    if (isAuthenticated && to.meta.role && to.meta.role !== userRole) {
        return {
            name: `${userRole}.dashboard`,
        }
    }

    return true
})

router.afterEach((to, from, failure) => {
    if (failure) {
        // 
    }
})

export default router
