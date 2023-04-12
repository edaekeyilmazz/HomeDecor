import productModel from '../models/product.js';

class ProductController {

    // #region CRUD METHODS

    // GET ALL
    static allproducts = async (req, res) => {
        try {
            const productList = await productModel.find({});
            console.log(productList);
            res.render('product_display.ejs', {productList: productList});
        } catch (error) {
            console.log(error);
        };
    }


    // FIND BY ID
    // WHEN CLICK EDIT BUTTON IN PRODUCTDISPLAY.EJS, OPEN EDIT PAGE
    static product_edit = async (req, res) => {
        const product_id = req. params.id;
        const productInfoFromDb = product_id != 0 ? await productModel.findById(product_id): null;
        console.log(productInfoFromDb != null ? productInfoFromDb.product_name : '' );
        res.render("product_edit", { product: productInfoFromDb });
    }

    // WHEN CLICK UPDATE BUTTON IN PRODUCTEDIT.EJS, UPDATE THE PRODUCT
    static product_update = async (req, res) => {
        const product_id = req.params.id;
        const updated_product = req.body;

        productModel.findByIdAndUpdate(product_id, {
            product_name: updated_product.product_name,
            product_code: updated_product.product_code,
            description: updated_product.description,
            price: updated_product.price,
            color: updated_product.color,
            brand: updated_product.brand,
            category: updated_product.category
        }).then((productInfoFromDb) => {
            console.log("=========================== Product has been updated successfully ==============================");
            console.log(productInfoFromDb);
            res.redirect("/allproducts");
        }).catch(error => {
            console.log(error);
        });
    }


     // WHEN CLICK INSERT BUTTON IN PRODUCTEDIT.EJS, INSERT THE PRODUCT
     static product_insert = async (req, res) => {
        // const product_id = req.params.id;
        const insert_product = req.body;

        productModel.create({
            product_name: insert_product.product_name,
            product_code: insert_product.product_code,
            description: insert_product.description,
            price: insert_product.price,
            color: insert_product.color,
            brand: insert_product.brand,
            category: insert_product.category
        }).then((productInfoFromDb) => {
            console.log("=========================== Product has been updated successfully ==============================");
            console.log(productInfoFromDb);
            res.redirect("/allproducts");
        }).catch(error => {
            console.log(error);
        });
    }


    // DELETE
    static product_delete = async (req, res) => {
        const product_id = req.params.id;

        productModel.findByIdAndDelete(product_id).then(() => {
            res.redirect("/allproducts");
        }).catch(error => {
            console.log(error);
        });
    }
}

export default ProductController
