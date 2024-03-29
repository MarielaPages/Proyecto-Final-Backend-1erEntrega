let products = []

// dibujo los productos en stock 

let productosContainer = document.getElementById('productos');

async function fetchProds(){
    await fetch('http://localhost:8080/api/productos')
    .then(res => res.json())
    .then(json => products = json) //aca el json es la rsta parseada y convertida a objeto javasript (array en este caso)

    if(products.length>0){
        productosContainer.innerHTML = products.map(product => {
            return (
                `<div class="card col-sm-12 col-md-4 col-lg-3 marginCards" style="width: 18rem;">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                    <div class="card-body" id="prod${product.id}">
                        <h5 class="card-title">${product.title}</h5>
                        <h5 class="card-title">Id: ${product.id}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Code: ${product.code}</p>
                        <p class="card-text">Price: ${product.price}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                        <button class="btn btn-primary" onclick="borrarProd(${product.id})">Delete</button>
                        <button class="btn btn-primary" onclick="update(${product.id})">Update</button>
                    </div>
                </div>`
            )
        }).join('')
    } else{
        productosContainer.innerHTML = `<p class="text-center">There are no products</p>`
    }
}

fetchProds()

// creo funcion para borrar producto por id 

function borrarProd(id){
    const options = { method: 'DELETE' }
    return fetch(`http://localhost:8080/api/productos/${id}`, options)
}

//creo funciones para actualizar productos por id

function update(id){
    const cardContenedor = document.getElementById(`prod${id}`)
    cardContenedor.innerHTML = `
                                <h2>Change Product</h2>
                                <form> 
                                    <input type="text" name="title" placeholder="Title" class="form-control" id="title">
                                    <input type="text" name="description" placeholder="Description" class="form-control" id="description">
                                    <input type="number" name="code" placeholder="Code" class="form-control" id="code">
                                    <input type="number" name="price" placeholder="Price" class="form-control" id="price">
                                    <input type="number" name="stock" placeholder="Stock" class="form-control" id="stock">
                                    <button class="btn btn-secondary" onclick="finishUpdate(${id})">Update</button>
                                </form>`
}

function finishUpdate(id){
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = document.getElementById('price').value
    const stock = document.getElementById('stock').value
    const prodModif = {title: title, description: description, code: code, price:price, stock:stock}

    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(prodModif)
    }
    return fetch(`http://localhost:8080/api/productos/${id}`, options)
}

//Funcion para crear carrito
async function crearCarrito(){
    let idCarrito = ''
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }
    await fetch(`http://localhost:8080/api/carrito/`, options)
    .then(res => res.json()) // el .json() funciona como un JSON.parse()
    .then(json => idCarrito = json)
    const crearCarritoContainer = document.getElementById('crearCarritoContainer');
    crearCarritoContainer.innerHTML = `
                                        <h4>Your cart id is ${idCarrito.idCarrito}. Don't forget it, you will need it.</h4>
                                        <button class="btn btn-secondary" onclick="deleteCart(${idCarrito.idCarrito})" id="deleteCart">Delete Cart</button>`
}

//funcion para borrar carrito
async function deleteCart(id){
    const options = { method: 'DELETE' }
    await fetch(`http://localhost:8080/api/carrito/${id}`, options)
    const crearCarritoContainer = document.getElementById('crearCarritoContainer');
    crearCarritoContainer.innerHTML = `
                                        <h4>Your cart has been deleted</h4>
                                        `
    
}

//funcion para comprar productos por id
async function buy(){
    const idCarrito = document.getElementById('idCarrito').value; //devuelven strings
    const idProdComprar = document.getElementById('idProdComprar').value;
    const idProdComprarObj = {idProd: idProdComprar}

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(idProdComprarObj)
    }
    await fetch(`http://localhost:8080/api/carrito/${idCarrito}/productos`, options)
    document.getElementById('idCarrito').value = ''
    document.getElementById('idProdComprar').value = ''
}

// Funcion para mostrar productos del carrito
async function mostrarProds(){
    let productosCarrito = []
    let prodsPorCarrito = document.getElementById('prodsPorCarrito');
    let tituloProdsPorCarrito = document.getElementById('tituloProdsPorCarrito');

    const idCarrito = document.getElementById('idCarritoMostrar').value; 

    await fetch(`http://localhost:8080/api/carrito/${idCarrito}/productos`)
    .then(res => res.json())
    .then(response => productosCarrito = response)

    if(productosCarrito.length>0){
        tituloProdsPorCarrito.innerHTML = 'These are your products:'
        prodsPorCarrito.innerHTML = productosCarrito.map(product => {
            return (
                `<div class="card col-sm-12 col-md-4 col-lg-3 marginCards" style="width: 18rem;">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                    <div class="card-body" id="prod${product.id}">
                        <h5 class="card-title">${product.title}</h5>
                        <h5 class="card-title">Id: ${product.id}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Code: ${product.code}</p>
                        <p class="card-text">Price: ${product.price}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                    </div>
                </div>`
            )
        }).join('')
    } else{
        productosContainer.innerHTML = `<p class="text-center">There are no products in your cart</p>`
    }
    document.getElementById('idCarritoMostrar').value = ''
}

//Funcion para borrar un producto del carrito
async function deleteProdCart(){
    let idCarrito = document.getElementById('idCarritoBorrarProd').value;
    let idProdBorrar = document.getElementById('idProdBorrar').value;
    let prodElim = document.getElementById('prodElim');

    const options = { method: 'DELETE' }
    await fetch(`http://localhost:8080/api/carrito/${idCarrito}/productos/${idProdBorrar}`, options)

    prodElim.innerHTML = `Se han eliminado los productos con id ${idProdBorrar}`
    
    document.getElementById('idCarritoBorrarProd').value = ''
    document.getElementById('idProdBorrar').value = ''
}

