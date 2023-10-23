const express = require('express'); 
const {conection} = require("./database/conection")
const cors = require("cors")

console.log("app encendida")

//conetcta a la bd
conection()

//crear servidor node

const app = express()
const port = 3900


app.use(cors())

//body a obj
app.use(express.json())
app.use(express.urlencoded({extended:true})) //recibiendo urlencoded

//crear rutas 
const articleRoutes = require("./routes/articlesRoutes")

app.use("/api", articleRoutes)

app.get("/probando", (req,res) => {
    console.log("estamos en /probando")
    return res.status(200).send({
        curso:"nodejs"
    })
})
//crear servidor y escuchar peticiones 
app.listen(port ,() => {
    console.log("listening on port" , port )
})