import  express  from 'express'
import ProductController from '../controllers/productController.js'

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

export default router