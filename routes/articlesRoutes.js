const express = require('express')
const router = express.Router()
const multer = require("multer")
const articleController = require("../controllers/articleController.js")


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"./imagenes/articulos")
    },
    filename: (req,file,cb) => {
        cb(null,"./articulo" + Date.now() + file.originalname)
    }
})

const uploads = multer({storage: storage})


router.get("/prueba", articleController.test)

//obtener
router.get("/articles/:ultimos?", articleController.listar)
router.get("/article/:id", articleController.uno)
router.delete("/article/:id", articleController.borrar)
router.put("/article/:id", articleController.editar)
router.post("/subir-imagen/:id",[uploads.single("file")], articleController.subir)
router.get("/imagen/:fichero", articleController.imagen)
router.get("/buscar/:busqueda", articleController.buscador)

//post 
router.post("/crear", articleController.crear)

module.exports = router