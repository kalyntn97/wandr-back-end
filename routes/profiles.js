import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/', profilesCtrl.index)
router.get('/:profileId', profilesCtrl.show)
router.get('/:profileId/followers', profilesCtrl.indexFollowers)
router.get('/:profileId/following', profilesCtrl.indexFollowing)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/:profileId/following/posts', checkAuth, profilesCtrl.explorePage)
router.put('/:id/add-photo', checkAuth, profilesCtrl.addPhoto)
router.put('/:profileId', checkAuth, profilesCtrl.update)
router.patch('/:profileId/follow', checkAuth, profilesCtrl.addFollow)
router.patch('/:profileId/unfollow', checkAuth, profilesCtrl.unFollow)
router.get('/:profileId/following/posts', checkAuth, profilesCtrl.explorePage)
router.delete('/:profileId',checkAuth,profilesCtrl.delete)
router.delete('/:profileId/saves/:postId', checkAuth, profilesCtrl.deleteSavedPosts)

export { router }
