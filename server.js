const express = require("express");
const app = express();
const routesproductos = require('./routes/routesProductos')
const routecarrito = require('./routes/routesCarrito')
const multer = require('multer')

//Seteo donde se guardaran los files y con que nombres
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname+"/public/files")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

//middlewares
app.use(multer({storage}).single("thumbnail"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
app.use('/api/productos', routesproductos);
app.use('/api/carrito', routecarrito)


//empiezo el server
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});

server.on('error', error => console.log(`Error en el servidor ${error}`))