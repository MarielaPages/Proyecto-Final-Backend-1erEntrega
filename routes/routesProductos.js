const Contenedor = require("../contenedor");
const { Router } = require('express');
const router = Router();

const archivoNuevo = new Contenedor("productos.txt");

//seteo si es admin o no
const isAdmin = true;

//creo middleware para verif si es admin o no
function adminOrUserPost(req, res, next){
    if (isAdmin){
        next()
    } else{
        res.json({error: -1, description: "route /api/productos/ metodo post no autorizado"})
    }
}

function adminOrUserPut(req, res, next){
    if (isAdmin){
        next()
    } else{
        res.json({error: -1, description: "route /api/productos/ metodo put no autorizado"})
    }
}

function adminOrUserDelete(req, res, next){
    if (isAdmin){
        next()
    } else{
        res.json({error: -1, description: "route /api/productos/ metodo delete no autorizado"})
    }
}

//Me traigo todos los productos 
router.get("/", async (request, response) => {
    const productos = await archivoNuevo.getAll();
    response.json(productos); 
});

//Traigo producto por id
router.get("/:id", async (request, response) => {
    const { id } = request.params;
    const productoSegunId = await archivoNuevo.getById(parseInt(id));
    response.json(productoSegunId);
});

//Agrego producto
router.post('/', adminOrUserPost, async (request, response) => {
    const producto = request.body; // esto es el objeto que llega con los datos (clave lo que esta en name del input del html y valor lo que uno escribe). Lo uso para pasarselo al save
    const imagen = request.file;
    producto.thumbnail = '/files/'+imagen.filename; // agrego esta propiedad al objeto
    const productoAgregado = await archivoNuevo.save(producto)
    response.redirect('/')
})

//actualizo producto por id
router.put("/:id", adminOrUserPut, async (request, response) => {
    const { id } = request.params;
    const idParse = parseInt(id);
    const productos = await archivoNuevo.getAll();
    const arrayIndexPorId = [] // aqui me guardo para cada elemento su id y el indice que tiene en el array
    productos.forEach((element, index) => {
        arrayIndexPorId.push({elemId: element.id, elemIndex:index})
    }); // uso esto para guardar id e indice en array
    const productoASuplirIdIndex = arrayIndexPorId.find(producto => producto.elemId === idParse); // busco el objeto que tiene el id del objeto a borrar y el indice del objeto en el array productos
    if (productoASuplirIdIndex){
        const indexElemSuplir = productoASuplirIdIndex.elemIndex; // obtengo el indice en el array productos del objeto a borrar (objeto cuyo id es el que se corresponde con el que quiero borrar)
        const productoModifEntrante = request.body; //guardo objeto con la data con la que quiero suplantar el otro objeto
        const productoModif = {id : idParse, ...productoModifEntrante} // armo objeto. Le pongo el mismo id del que voy a eliminar y le agrego la info con la que quiero suplirlo
        const d = new Date();
        let date = `${d.getDate()}/${1 + d.getMonth()}/${d.getFullYear()}`
        productoModif.timestamp = date;
        productoModif.thumbnail = productos[indexElemSuplir].thumbnail; //!!Por ahora uso esto, dsp ver si aplico file en un form para usar multer
        productos.splice(indexElemSuplir, 1, productoModif) //borro elemento con el id corresp y lo reemplazo por el nuevo objeto
        await archivoNuevo.save2(productos)
        response.redirect('/')
    }else{
        response.send("no existe el elemento que busca modificar")
    }
});

//borro producto por id
router.delete("/:id", adminOrUserDelete, async (request, response) => {
    const { id } = request.params;
    const productos = await archivoNuevo.getAll();
    const productoBorrar = productos.find(producto => producto.id === parseInt(id));
    if(productoBorrar){
        await archivoNuevo.deleteById(parseInt(id));
        response.redirect('/')
    }
    else{
        response.json({mensaje: "no existia producto a borrar"})
    }
});

module.exports = router;

