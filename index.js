const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const app = express()
const mongoose = require('mongoose')

/*
const hskey = fs.readFileSync('server-key.pem')
const hscert = fs.readFileSync('server-cert.pem')
const options = {
    key: hskey,
    cert: hscert
}
const httpsServer = https.createServer(credentials
const app = express().createServer(options)
*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//Si el puerto no se especifica en las variables de entorno
//se pone por defecto el 3000
app.set('port', process.env.PORT || 3000)

require('./models/user.model')
app.use('/', require('./routes/user.routes'))

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com")
  res.setHeader("x-xss-protection", "1; mode=block")
  res.setHeader("strict-transport-security", "max-age=31536000; includeSubDomains; preload")
  //res.setHeader("Public-Key-Pins", 'pin-sha256="<pin-value>"; max-age=<expire-time>; includeSubDomains; report-uri="<uri>"')
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return next()
})
//Iniciando el servidor https con el módulo de NodeJS
/*
httpsServer.listen(app.get('port'), () => {
  console.log(`Servidor ejecutandose en el puerto ${app.get('port')}`)
})
*/

mongoose.connect('mongodb://localhost', function(err) {
    app.listen(app.get('port'), function(){
        console.log(`Servidor ejecutandose en el puerto ${app.get('port')}`)
    })
})
