fs = require('fs');

class ContenedorCarritos{
    constructor(archivo){
        this.file = archivo;
    }

    async createCart(){
        try{
            const carritos = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayCarritos = JSON.parse(carritos);
            let posteriorId = 0;
            if(arrayCarritos.legth === 0){
                posteriorId = 1
            }
            else{
                let ultimoId=0
                arrayCarritos.forEach(element => {
                    ultimoId=element.id
                });
                posteriorId = ultimoId + 1
            }
            const d = new Date();
            let date = `${d.getDate()}/${1 + d.getMonth()}/${d.getFullYear()}`
            let carrito = {
                id: posteriorId,
                timestamp : date,
                products : []
            }
            arrayCarritos.push(carrito);
            await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayCarritos)}`);
            return posteriorId;
        }
        catch(err){
            console.log("creatCart error", err)
        }
    }
    async getById(id){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayCarritos = JSON.parse(contenido);
            const carritoEncontrado = arrayCarritos.find(carrito => carrito.id === id);
            if (carritoEncontrado === undefined){
                const error = {error: 'producto no encontrado'};
                return error;
            }
            else{
                return carritoEncontrado;
            }
        }
        catch(err){
            console.log("getById Cart error",err);
        }
    }
    async deleteById(id){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayCarritos = JSON.parse(contenido);
            const carritoEncontrado = arrayCarritos.find((carrito) => carrito.id === id);
            if(carritoEncontrado){
                const arrayMenosCarrito = arrayCarritos.filter((carrito) => carrito.id !== id);
                await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayMenosCarrito)}`);
                return `el carrito con id ${id} fue eliminado existosamente`
            } else{
                return `no habia carrito para eliminar`
            }
        }
        catch(err){
            console.log("deleteById Cart error",err);
        }
    }
    async getAllById(id){
        try{
            const carritos = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayCarritos = JSON.parse(carritos);
            const carritoBorrar = arrayCarritos.find((carrito) => carrito.id === id)
            if(carritoBorrar){
                const carrito = await this.getById(id)
                return carrito.products;
            }
            else{
                return `no existe el carrito`
            }
        }
        catch(err){
            console.log("getAllById Cart error",err);
        }
    }
    async getAll(){
        try{
            const carritos = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            const arrayCarritos = JSON.parse(carritos);
            return arrayCarritos;
        }
        catch(err){
            console.log("getAllById Cart error",err);
        }
    }
    async saveArray(array){
        try{
            const contenido = await fs.promises.readFile(`./dataBase/${this.file}`, 'utf-8');
            let arrayCarritos = JSON.parse(contenido);
            arrayCarritos = array;
            await fs.promises.writeFile(`./dataBase/${this.file}`, `${JSON.stringify(arrayCarritos)}`);
            return arrayCarritos
        }
        catch(err){
            console.log("save error",err)
        }
    }
}

module.exports = ContenedorCarritos;