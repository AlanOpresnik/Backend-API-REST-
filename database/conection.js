const mongoose = require('mongoose')

const conection = async () => {
    try {
       await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog")
       console.log("la conexion fue exitosa")
    } catch (error) {
        console.log(error)
        throw new Error("NO SE HA PODIDO CONECTAR A LA BASE DE DATOS")
    }
}
module.exports = {
    conection
}