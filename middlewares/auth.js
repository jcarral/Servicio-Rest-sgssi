const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('./../config')


/*
* Middleware encargado de validar en el token de autenticacion
 */
exports.validateAuth = function(req, res, next) {
  //Comprueba si existe un header del tipo authorization
  //porque es en él donde debe viajar el token
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Petición incorrecta"})
  }

  //Separa el token del esquema de autorización
  let token = req.headers.authorization.split(" ")[1]
  let payload = jwt.decode(token, config.TOKEN_SECRET) //Decodifica el token para obtener el payload

  //Comprueba si ha caducado
  if(payload.exp <= moment().unix()) {
     return res
         .status(401)
        .send({message: "El token ha expirado"})
  }

  //El token es valido, por lo tanto se almacena en req.user el id del usuario que es propietario
  //de ese token.
  //Desde ahora en adelante se puede obtener el usuario accediendo al objeto request
  req.user = payload.sub
  next() //Cambia al siguiente paso del ciclo de vida de una petición
}
