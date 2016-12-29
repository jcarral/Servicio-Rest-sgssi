const express = require('express')
const router = express.Router()
const User = require('../controllers/user.ctrl')
const auth = require('./../middlewares/auth')

//Rutas para registrarse o autenticarse,
//no hace falta esta logeado
router.post('/login', User.login)
router.post('/registro', User.registro)

/*
 * Para poder limitar el acceso a ciertos usuario hay que utilizar el middlwware validateAuth
 * que hemos creado.
 * Es importante escribir la linea con el middleware por delante de las rutas "secretas" porque se ejecutan
 * en orden descente, si una ruta estuviera por encima no se validararia el token 
 */
router.post(/user/, auth.validateAuth)
router.post('/user/secret', User.secretArea)

module.exports = router
