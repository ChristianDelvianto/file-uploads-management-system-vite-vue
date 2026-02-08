import type { RouteRecordRaw } from 'vue-router'
import adminRoutes from './admin.routes'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'

const routes: RouteRecordRaw[] = [
    ...adminRoutes,
    ...authRoutes,
    ...userRoutes,
]

export default routes
