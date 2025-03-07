const ProductManager = require('../dao/dbManagers/productsManager');
const ProductModel = require('../dao/models/product.model');
const CartManager = require('../dao/dbManagers/cartManager');
const { usersService } = require('../repositories');

const manager = new ProductManager();
const cartManager = new CartManager();

class ViewsController {

    static async goHome(req, res) {
        const products = await manager.getProducts();
        res.render('home', {
            products,
            title: 'Product List'
        });
    };

    static async getRealTimeProducts(req, res) {
        const products = await manager.getProducts();
        res.render('realTimeProducts', {
            products,
            style: 'styles.css',
            title: 'RealTimeProducts'
        });
    };

    static async getChat(req, res) {
        try {
            res.render('chat',{})
        } catch (error) {
            res.status(error.status || 500).send({status: 'Error', error: error.message})
        }
    };

    static async getProducts(req, res) {

        let limit = req.query.limit || 10;
        let page = req.query.page || 1;
        let sort = parseInt(req.query.sort);
        let opt = {};
        let status = 'success';
    
        try {
            if (req.query.query){
                opt = {
                    $or: [{description:req.query.query }, {category: req.query.query} ]
                }
            }
    
            let sortOption = {}
            if (sort) {
                sortOption = { price: sort };
            }
    
            let {docs, ...rest} = await ProductModel.paginate(opt, { limit: limit, page: page, sort: sortOption, lean: true });
            let products = docs;

            const cart = await cartManager.getCartLean(req.user.cart);
    
            let nextLink = rest.hasNextPage ? `/api/products?page=${rest.nextPage}` : null
            let prevLink = rest.hasPrevPage ? `/api/products?page=${rest.prevPage}` : null
    
            res.render('products',{products, cart, ...rest, nextLink, prevLink, user: req.session.user})
    
        } catch (error) {
            status = 'error';
            res.status(500).send({ status, error: error.message });
        }
    };

    static async getCart(req, res) {

        try {
            const cartId = req.params.cid;
    
            const cart = await cartManager.getCartLean(cartId);
    
            res.render('carts', {cart, user: req.session.user})
            
        } catch (error) {
            res.send({status:'error', error: error.message})
        }
    };

    static async register(req, res) {
        res.render('register', {});
    };

    static async login(req, res) {
        res.render('login');
    };

    static getPasswordResetForm(req, res){
        try{
            res.render('resetPassword',{user: {}})
        } catch (error) {
            res.status(error.status || 500).send({status:'error', error: error.message})
        }
    }
    
    static getPasswordChangeForm(req, res){
        try{
            res.render('passwordChange',{user: {}})
        } catch (error) {
            res.status(error.status || 500).send({status:'error', error: error.message})
        }
    }

    static async getUsersManager(req, res){
        try{
            const users = await usersService.getAll();
            const usersWithRoleFlags = users.map(user=>{
                user.isUser = user.role == 'user'
                user.isPremium = user.role == 'premium'
                user.isAdmin = user.role == 'admin'
                return user;
            })
            res.render('usersManager',{users: users})
        } catch (error) {
            res.status(error.status || 500).send({status:'error', error: error.message})
        }
    }

    static getPurchaseSuccess(req, res){
        try{
            res.render('purchaseSuccess')
        } catch (error) {
            res.status(error.status || 500).send({status:'error', error: error.message})
        }
    }

}

module.exports = ViewsController;