import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/', checkAuth, postsCtrl.create)
router.get('/', postsCtrl.index) // no checkAuth currently due to not needing to login to view index of posts?
router.get('/:postId', postsCtrl.show)


export { router }