const validator = require("validator");
const Article = require("../models/Article");
const fs = require("fs");
const path = require("path");

const test = (req, res) => {
  return res.status(200).json({
    msg: "exito al hacer la peticion",
  });
};

const crear = (req, res) => {
  //recojer parametros por post a guardar

  let parametros = req.body;

  //validar datos

  validarArticulo(res, parametros);

  //crear el obj a guardar

  const article = new Article(parametros);

  //guardar en la bd

  article
    .save()
    .then((articleSave) => {
      return res.status(200).json({
        status: "success",
        article: articleSave,
        mensaje: "Articulo creado con exito",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo: " + error.message,
      });
    });

  //devolver resultado
};

const listar = (req, res) => {
  let consulta = Article.find({});
  if (parseInt(req.params.ultimos)) {
    consulta.limit(req.params.ultimos);
  }
  consulta.sort({ fecha: -1 }).then((articles) => {
    if (!articles) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos: " + error.message,
      });
    }
    return res.status(200).json({
      status: "succes",
      parametro: req.params.ultimos,
      articles,
    });
  });
};

const uno = (req, res) => {
  //id
  let id = req.params.id;
  //buscar
  Article.findById(id).then((article) => {
    {
      //si no existe error
      if (!article) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se ha encontrado articulo " + error.message,
        });
      }
      //resultado

      return res.status(200).json({
        status: "succes",
        article,
      });
    }
  });
};

const borrar = (req, res) => {
  const id = req.params.id;

  Article.findOneAndDelete({ _id: id }).then((articleDelete) => {
    if (!articleDelete) {
      return res.status(500).json({
        status: "error",
        msg: "error al borrar",
      });
    }
    return res.status(200).json({
      status: "succes",
      articulo: articleDelete,
      msg: "articulo borrado",
    });
  });
};

const editar = async (req, res) => {
  const id = req.params.id;
  const parametros = req.body;
  try {
    // Validar los datos
    const validarTitle =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, {
        min: 5,
        max: undefined,
      });
    const validarContenido = !validator.isEmpty(parametros.contenido);

    if (!validarTitle || !validarContenido) {
      throw new Error("No se han podido validar los datos");
    }

    // Actualizar el artículo
    const articleUpdate = await Article.findOneAndUpdate(
      { _id: id },
      parametros,
      { new: true }
    );

    if (!articleUpdate) {
      return res.status(404).json({
        status: "error",
        msg: "Artículo no encontrado o error al actualizar",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articleUpdate,
      msg: "Actualizado con éxito",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

const validarArticulo = (res, parametros) => {
  try {
    let validarTitle =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, {
        min: 5,
        max: undefined,
      });
    let validarContenido = !validator.isEmpty(parametros.contenido);
    if (!validarTitle || !validarContenido) {
      throw new Error("no se ah podido validar ");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error 404",
      msg: "error",
    });
  }
};

const subir = async (req, res) => {
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error 404",
      msg: "peticion invalida",
    });
  }

  let fileName = req.file.originalname;
  let splitFileName = fileName.split(".");
  let extention = splitFileName[1];

  if (
    extention != "png" &&
    extention != "jpg" &&
    extention != "jpeg" &&
    extention != "gif"
  ) {
    fs.unlink(req.file.path, (error) => {
      res.status(400).json({
        status: "error",
        mensaje: "archivo inválido",
      });
    });
  } else {
    const id = req.params.id;

    try {
      const articleUpdate = await Article.findOneAndUpdate(
        { _id: id },
        { img: req.file.filename },
        { new: true }
      );

      if (!articleUpdate) {
        return res.status(404).json({
          status: "error",
          msg: "Artículo no encontrado o error al actualizar",
        });
      }

      return res.status(200).json({
        status: "success",
        articleUpdate,
        fichero: req.file,

        msg: "Actualizado con éxito",
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        msg: error.message,
        fichero: req.file,
      });
    }
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta = "./imagenes/articulos/" + fichero;

  fs.stat(ruta, (error, exist) => {
    if (exist) {
      return res.sendFile(path.resolve(ruta));
    } else {
      return res.status(404).json({
        status: "error",
        msg: "la imagen no existe",
      });
    }
  });
};

const buscador = (req, res) => {
  //sacar el string de busqueda
  let busqueda = req.params.busqueda;

  //find OR

  Article.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  })
    .sort({ fecha: -1 })
    .then((articles) => {
      if (!articles || articles.length <= 0) {
        return res.status(404).json({
          msg: "error no se entro articulo",
        });
      } else {
        return res.status(200).json({
          status: "success",
          articles,
        });
      }
    });

  //consulta

  //resultado
};
module.exports = {
  test,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};
