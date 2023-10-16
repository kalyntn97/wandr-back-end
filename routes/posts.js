import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========
router.get('/', postsCtrl.index) // no checkAuth currently due to not needing to login to view index of posts?
router.get('/:postId', postsCtrl.show) // no checkAuth currently due to not needing to login to view index of posts?


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/', checkAuth, postsCtrl.create)
router.post('/:postId/comments', checkAuth, postsCtrl.createComment)
router.post('/:postId/recommendations', postsCtrl.createRec)
router.put('/:postId', checkAuth, postsCtrl.update)
router.patch('/:postId/mainPhoto', checkAuth, postsCtrl.addPostPhoto)
router.delete('/:postId/deletePostPhoto', checkAuth, postsCtrl.deletePostPhoto)
router.patch('/:postId/comments/:commentId', checkAuth, postsCtrl.updateComment)
router.patch('/:postId/recommendations/:recommendationId', checkAuth, postsCtrl.updateRec)
router.patch('/:postId/likes', checkAuth, postsCtrl.likePost)
router.patch('/:postId/saves', checkAuth, postsCtrl.savePost)
router.delete('/:postId', checkAuth, postsCtrl.delete)
router.delete('/:postId/comments/:commentId', checkAuth, postsCtrl.deleteComment)
router.delete('/:postId/recommendations/:recommendationId', checkAuth, postsCtrl.deleteRec)

export { router }