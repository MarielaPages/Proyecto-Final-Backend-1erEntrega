const { Router, response } = require('express');
const router = Router();
const Contenedor = require('../contenedor')
const ContenedorCarritos = require('../contenedorCarritos')

const archivoProductos = new Contenedor("productos.txt");
const archivoCarrito = new ContenedorCarritos('carritos.txt')

//Creo carrito y devuelvo id
router.post('/', async (req, res) => {
    const newCart = await archivoCarrito.createCart()
    res.json({idCarrito: newCart}) 
})

//borro carrito por id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const nuevoArchivo = await archivoCarrito.deleteById(parseInt(id));
    res.json({CarritoEliminado : nuevoArchivo})
})

//Me traigo los productos de un carrito
router.get('/:id/productos', async(req, res) =>{
    const { id } = req.params;
    const productosCarrito = await archivoCarrito.getAllById(parseInt(id));
    res.json(productosCarrito)
})

//agrego producto por id a un carrito por id
router.post('/:id/productos', async (req, res) => {
    const {id} = req.params;
    const { idProd } = req.body;

    const carritos = await archivoCarrito.getAll();
    const arrayIndexPorId = [] // aqui me guardo para cada elemento su id y el indice que tiene en el array
    carritos.forEach((element, index) => {
        arrayIndexPorId.push({elemId: element.id, elemIndex:index})
    }); // uso esto para guardar id e indice en array
    const carritoASuplirIdIndex = arrayIndexPorId.find(carrito => carrito.elemId === parseInt(id)); // busco el objeto que tiene el id del objeto a borrar y el indice del objeto en el array productos
    
    if (carritoASuplirIdIndex){
        const carrito = await archivoCarrito.getById(parseInt(id));
        const productos = await archivoProductos.getAll(); 
        const productoBuscado = productos.find(producto => producto.id === parseInt(idProd))
        if(productoBuscado){
            const producto = await archivoProductos.getById(parseInt(idProd))
            carrito.products.push(producto);

            const indexElemSuplir = carritoASuplirIdIndex.elemIndex; // obtengo el indice en el array carritos del objeto a borrar (objeto cuyo id es el que se corresponde con el que quiero borrar)
            carritos.splice(indexElemSuplir, 1, carrito)
            
            await archivoCarrito.saveArray(carritos);
            res.json ({mensaje: `producto con id ${idProd} agregado al carrito`})
            
        } else{
            res.json({mensaje: 'no existe el producto que busca incluir'})
        }
        
    }else{
        res.send("no existe el carrito que busca modificar")
    }
}) //supongo que el id del producto llega en el body de la peticion, como si lo escribieran en un formulario
// el json de este post seria { "idProd": elId }

//Elimino producto por id de un carrito por id
router.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id } = req.params;
    const { id_prod } = req.params;

    const carritos = await archivoCarrito.getAll();
    const arrayIndexPorId = [] // aqui me guardo para cada elemento su id y el indice que tiene en el array
    carritos.forEach((element, index) => {
        arrayIndexPorId.push({elemId: element.id, elemIndex:index})
    }); // uso esto para guardar id e indice en array
    const carritoASuplirIdIndex = arrayIndexPorId.find(carrito => carrito.elemId === parseInt(id)); // busco el objeto que tiene el id del objeto a borrar y el indice del objeto en el array productos
    
    if (carritoASuplirIdIndex){
        const carrito = await archivoCarrito.getById(parseInt(id));
        const productoBuscadoCarrito = carrito.products.find(producto => producto.id === parseInt(id_prod))
        if(productoBuscadoCarrito){
            const arrayCarritoMenosProd = carrito.products.filter(producto => producto.id !== parseInt(id_prod));
            carrito.products = arrayCarritoMenosProd;

            const indexElemSuplir = carritoASuplirIdIndex.elemIndex; // obtengo el indice en el array carritos del objeto a borrar (objeto cuyo id es el que se corresponde con el que quiero borrar)
            carritos.splice(indexElemSuplir, 1, carrito)
            
            await archivoCarrito.saveArray(carritos);
            res.json ({mensaje: `productos con id ${id_prod} eliminados del carrito`})
            
        } else{
            res.json({mensaje: 'no existe el producto que busca borrar'})
        }
        
    }else{
        res.send("no existe el carrito que busca modificar")
    }
})


module.exports = router;