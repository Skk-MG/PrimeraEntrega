const getProductErrorInfo = (product) => {
    return `Una o mas propiedades fueron invalidas o incompletas
    Lista de propiedades requeridas:
        *title: se esperaba String, received ${product.title} 
        *description: se esperaba String, received ${product.description} 
        *price: se esperaba Number, received ${product.price} 
        *code: se esperaba String, received ${product.code} 
        *stock: se esperaba Number, received ${product.stock} 
        *category: se esperaba String, received ${product.category} 
        `
}

const getIdErrorInfo = (id) => {
    return `La propiedad ID es inexistente, invalida o incompleta
    *se recibio: ${id}
    `
}

module.exports = {
    getProductErrorInfo,
    getIdErrorInfo
};