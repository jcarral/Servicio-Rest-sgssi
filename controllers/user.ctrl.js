const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('./../config')

/**
 * Función para generar JWT
 * @param  {USER} Usuario del que se va a generar el token
 * @return {String} Token de autenticación con una caducidad de 7 días
 */
const __createToken = function(user) {
  var payload = {
    sub: user._id, //id del usuario, como elemento representativo del usuario en el token
    iat: moment().unix(),
    exp: moment().add(7, "days").unix(),
  }
  return jwt.encode(payload, config.TOKEN_SECRET);
}
exports.createToken = __createToken

/**
* Función para registrar nuevos usuarios
 */
exports.registro = function(req, res) {
  //Se crea un nuevo usuario con los campos del request utilizando
  //el constructor del modelo User
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    })

    //Funcion para almacenar en la base de datos el usuario
    user.save(function(err){
        return res
            .status(200)
            .send({token: __createToken(user)}) //La respuesta es un token de autenticación del nuevo usuario
    })
}

/*
* Función de prueba para area resgtringida
 */
exports.secretArea = function(req, res) {
        return res
            .status(200)
            .send({message: 'Acabas de acceder al area secreta de usuario'})
}

/*
* Función para autenticarse en el servicio
 */
exports.login = function(req, res) {
  //Busca un usuario en la BD que tenga un nombre igual al recibido por parametros
    User.findOne({username: req.body.username.toLowerCase()}, function(err, user) {
        if (err || user === null) return res.status(404).send() //Si no existe o ha ocurrido un error
        /*
         * Se comprueba si las contraseñas coinciden utilizando la función que hemos creado
         * en el modelo usuario
        */
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) return res.status(400).send() //Si ha ocurrido un error al comparar
          else if(isMatch) return res.status(200).send({token: __createToken(user)}) //Si las contraseñas coinciden se devuelve token
          else return res.status(400).send() //Autenticación erronea
        })
    })
}
