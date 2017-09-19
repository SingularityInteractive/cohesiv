import * as express from 'express'
import authRoutes from './auth.route'

const router = express.Router() // eslint-disable-line new-cap

// mount auth routes at /auth
router.use('/auth', authRoutes)

export default router
