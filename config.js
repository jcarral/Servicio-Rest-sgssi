/*
* Importante: NO SUBIR ESTE FICHERO A UN REPOSITORIO
* Esto es una excepción pero los archivos con contenido sensible como contraseñas
* hay que añadirlos al ficheros .gitignore para que no se suban a VCS.
* Además es también una buena practica utilizar las variables de entorno para guardar algunas contraseñas
*/
module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto"
}
