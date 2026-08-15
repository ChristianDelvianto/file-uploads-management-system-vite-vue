import authRoutes from './auth.routes'
import fileRoutes from './file.routes'
import userRoutes from './user.routes'

export default [
    ...authRoutes,
    ...fileRoutes,
    ...userRoutes
]
