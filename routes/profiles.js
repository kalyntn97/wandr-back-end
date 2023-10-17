import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/:profileId', profilesCtrl.show)
router.get('/:profileId/followers', profilesCtrl.indexFollowers)
router.get('/:profileId/following', profilesCtrl.indexFollowing)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/', checkAuth, profilesCtrl.index)
router.put('/:id/add-photo', checkAuth, profilesCtrl.addPhoto)
router.put('/:profileId', checkAuth, profilesCtrl.update)
router.patch('/:profileId/', checkAuth, profilesCtrl.addFollow)
router.get('/:profileId/following/posts', checkAuth, profilesCtrl.explorePage)

export { router }
