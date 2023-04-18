const express = require('express');
const router = express.Router();
const {auth} = require('../controller/index');
const { verifyTokenFn } = require('../utils/jwt')


router.post('/sign-up', auth.signUp)
router.post('/sign-in',auth.signIn)
router.post('/forget-password', auth.forgetPassword)
router.post('/reset-password', auth.resetPassword)
router.post('/refresh-token', auth.refreshJWTToken)

module.exports = router;
