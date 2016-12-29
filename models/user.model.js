const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

//Modelo de usuario
let UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER']}
})

/*
* Función para cifrar las contraseñas al registrarse.
* Cuando se ha creado un usuario con el constructor no se ha almacenado en la base datos,
* es al ejecutar la funcion save. Esta función de cifrado se ejecuta al llamar a save de la nueva instancia
* y cifra la contraseña utilizando un algoritmo BCRYPT
*/
UserSchema.pre('save', function(next){
  let user = this
   if (!user.isModified('password')) return next()
   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash
            next()
        })
    })
})

/*
* Método para comprar si la contraseña del usuario y el string que se recibe (contraseña candidata)
* son equivalentes. Utiliza la función compare de la libreria bcrypt
*/
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)
