import stockModel from '../models/stock.js';
import productModel from '../models/product.js';
import storeModel from '../models/store.js';

class StockController {

    // #region CRUD METHODS

    // GET ALL
    static allstocks = async (req, res) => {
        try {
            const stockList = await stockModel.find({});


            const stockListAgg = await stockModel.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'product_details'
                    }
                },{
                    $lookup: {
                        from: 'stores',
                        localField: 'store',
                        foreignField: '_id',
                        as: 'store_details'
                    }
                },{
                    $unwind: "$product_details"
                },{
                    $unwind: "$store_details"
                }, 
                {
                    $project: {
                        id: "$_id",
                        product: "$product",
                        store: "$store",
                        quantity: 1,
                        "product_details.product_name": 1,
                        "store_details.store_name": 1
                    }
                }
            ]);

            console.log(stockListAgg);
            console.log(stockList);

            res.render('stock_display.ejs', {stockList: stockListAgg});
        } catch (error) {
            console.log(error);
        };
    }


    // FIND BY ID
    // WHEN CLICK EDIT BUTTON IN STOCKDISPLAY.EJS, OPEN EDIT PAGE
    static stock_edit = async (req, res) => {
        const stock_id = req.params.id;
        const stockInfoFromDb = stock_id != 0 ? await stockModel.findById(stock_id) : null;

        const storeList = await storeModel.find({});
        const productList = await productModel.find({});

        res.render("stock_edit", {
            stock: stockInfoFromDb,
            productList: productList,
            storeList: storeList
        });
    }

    // WHEN CLICK UPDATE BUTTON IN STOCKEDIT.EJS, UPDATE THE STOCK
    static stock_update = async (req, res) => {
        const stock_id = req.params.id;
        const updated_stock = req.body;

        stockModel.findByIdAndUpdate(stock_id, {
            quantity: updated_stock.quantity,
            product: updated_stock.product,
            store: updated_stock.store
        }).then((stockInfoFromDb) => {
            console.log("=========================== Stock has been updated successfully ==============================");
            console.log(stockInfoFromDb);
            res.redirect("/allstocks");
        }).catch(error => {
            console.log(error);
        });
    }


    // WHEN CLICK INSERT BUTTON IN STOCKEDIT.EJS, INSERT THE STOCK
    static stock_insert = async (req, res) => {
        const insert_stock = req.body;

        stockModel.create({quantity: insert_stock.quantity, product: insert_stock.product, store: insert_stock.store}).then((stockInfoFromDb) => {
            console.log("=========================== Stock has been updated successfully ==============================");
            console.log(stockInfoFromDb);
            res.redirect("/allstocks");
        }).catch(error => {
            console.log(error);
        });
    }


    // DELETE
    static stock_delete = async (req, res) => {
        const stock_id = req.params.id;

        stockModel.findByIdAndDelete(stock_id).then(() => {
            res.redirect("/allstocks");
        }).catch(error => {
            console.log(error);
        });
    }
}

export default StockController
