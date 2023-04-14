import  express  from 'express'
import ProductController from '../controllers/productController.js'
import CustomerController from '../controllers/customerController.js'
import StoreController from '../controllers/storeController.js'
// import { validateProduct } from '../middleware/validation.js';

const router = express.Router()

// router.get('/home', ProductController.homepage)
router.get('/home', function(req, res){
    res.render('home.ejs');
});

// Product 
router.get('/allproducts', ProductController.allproducts)
router.get('/product_edit/:id', ProductController.product_edit)
router.post('/product_insert', ProductController.product_insert)
router.post('/product_update/:id', ProductController.product_update)
router.get('/product_delete/:id', ProductController.product_delete)

// Customer 
router.get('/allcustomers', CustomerController.allcustomers)
router.get('/customer_edit/:id', CustomerController.customer_edit)
router.post('/customer_insert', CustomerController.customer_insert)
router.post('/customer_update/:id', CustomerController.customer_update)
router.get('/customer_delete/:id', CustomerController.customer_delete)

// Store 
router.get('/allstores', StoreController.allstores)
router.get('/store_edit/:id', StoreController.store_edit)
router.post('/store_insert', StoreController.store_insert)
router.post('/store_update/:id', StoreController.store_update)
router.get('/store_delete/:id', StoreController.store_delete)


export default router