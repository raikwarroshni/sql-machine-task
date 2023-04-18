const express = require('express');
const {user} = require('../controller/index');
const router = express.Router();
const { verifyTokenFn } = require('../utils/jwt')

router.put('/update-profile', verifyTokenFn, user.updateProfile)
router.get('/show-profile', verifyTokenFn, user.showProfile)
router.get('/search-friend', verifyTokenFn, user.searchFriend)
router.get('/view-profile/:userId',verifyTokenFn, user.viewProfileByUserId)
router.post('/friend-request', verifyTokenFn, user.sendFriendRequest)
router.get('/friends-list', verifyTokenFn,user.friendsList)
router.put('/friend-request', verifyTokenFn,user.acceptOrRejectRequest)



module.exports = router;