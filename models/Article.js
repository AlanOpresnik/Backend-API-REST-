const {Schema, model} = require("mongoose")


const articlesSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now(),
        
    },
    img: {
        type: String,
        default: "default.png",
        required: true
    },
})

module.exports = model("Article",articlesSchema )