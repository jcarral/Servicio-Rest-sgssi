const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('./../config')

const __createToken = function(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  }
  return jwt.encode(payload, config.TOKEN_SECRET);
}
exports.createToken = __createToken

exports.registro = function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    })

    user.save(function(err){
        return res
            .status(200)
            .send({token: __createToken(user)})
    })
}

exports.login = function(req, res) {
    User.findOne({username: req.body.username.toLowerCase()}, function(err, user) {
        if (err || user === null) return res.status(404).send()
        //Se comprueba si las contraseñas coinciden
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) return res.status(400).send()
          else if(isMatch) return res.status(200).send({token: __createToken(user)})
          else return res.status(400).send()
        })
    })
}
