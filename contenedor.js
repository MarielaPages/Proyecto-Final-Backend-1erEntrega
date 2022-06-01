fs = require('fs');

//creo la clase con sus metodos 
class Contenedor{
    constructor(archivo){
        this.file = archivo;
    }
    
    async save(object){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayProductos = JSON.parse(contenido);
            let posteriorId = 0;
            if(arrayProductos.legth === 0){
                posteriorId = 1
            }
            else{
                let ultimoId=0
                arrayProductos.forEach(element => {
                    ultimoId=element.id
                });
                posteriorId = ultimoId + 1
            }
            const d = new Date();
            let date = `${d.getDate()}/${1 + d.getMonth()}/${d.getFullYear()}`
            let objeto = {
                id : posteriorId,
                title : object.title,
                description: object.description,
                code: object.code,
                price : object.price,
                stock: object.stock,
                timestamp: date,
                thumbnail : object.thumbnail
            }
            arrayProductos.push(objeto);
            await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayProductos)}`);
            return posteriorId;
        }
        catch(err){
            console.log("save error",err)
        }
    }
    async save2(array){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            let arrayProductos = JSON.parse(contenido);
            arrayProductos = array;
            await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayProductos)}`);
            return arrayProductos
        }
        catch(err){
            console.log("save error",err)
        }
    }
    async getById(id){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayProductos = JSON.parse(contenido);
            const productoEncontrado = arrayProductos.find(producto => producto.id === id);
            if (productoEncontrado === undefined){
                const error = {error: 'producto no encontrado'};
                return error;
            }
            else{
                return productoEncontrado;
            }
        }
        catch(err){
            console.log("getById error",err);
        }
    }
    async getAll(){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayProductos = JSON.parse(contenido);
            return arrayProductos;
        }
        catch(err){
            console.log("getAll error",err);
        }
    }
    async deleteById(id){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayProductos = JSON.parse(contenido);
            const productoEncontrado = arrayProductos.find((producto) => producto.id === id);
            if(productoEncontrado){
                const arrayMenosProducto = arrayProductos.filter((producto) => producto.id !== id);
                await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayMenosProducto)}`);
                console.log(`el producto fue eliminado existosamente`)
            } else{
                console.log(`no habia producto para eliminar`)
            }
        }
        catch(err){
            console.log("deleteById error",err);
        }
    }
    async deleteAll(){
        try{
            const arrayEliminarTodo = [];
            await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayEliminarTodo)}`);
            console.log(`objetos eliminados exitosamente`)
        }
        catch(err){
            console.log('deleteAll error', err)
        }
    }
}

module.exports = Contenedor;

