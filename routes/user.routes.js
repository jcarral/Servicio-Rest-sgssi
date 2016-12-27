const express = require('express')
const router = express.Router()
const User = require('../controllers/user.ctrl')
const auth = require('./../middlewares/auth')



router.post('/login', User.login)
router.post('/registro', User.registro)

router.post(/user/, auth.validateAuth)
router.post('/user/secret', User.secretArea)

module.exports = router
