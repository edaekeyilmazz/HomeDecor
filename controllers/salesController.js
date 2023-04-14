import salesModel from '../models/sales.js';
import productModel from '../models/product.js';
import storeModel from '../models/store.js';
import customerModel from '../models/customer.js';

class SalesController {

    // #region CRUD METHODS

    // GET ALL
    static allsales = async (req, res) => {
        try {
            const salesList = await salesModel.find({});


            // const salesListAgg = await salesModel.aggregate([
            //     {
            //         $lookup: {
            //             from: 'products',
            //             localField: 'product',
            //             foreignField: '_id',
            //             as: 'product_details'
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: 'stores',
            //             localField: 'store',
            //             foreignField: '_id',
            //             as: 'store_details'
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: 'customers',
            //             localField: 'customer',
            //             foreignField: '_id',
            //             as: 'customer_details'
            //         }
            //     },
            //     {
            //         $unwind: "$product_details"
            //     }, {
            //         $unwind: "$store_details"
            //     }, {
            //         $unwind: "$customer_details"
            //     }, {
            //         $project: {
            //             id: "$_id",
            //             product: "$product",
            //             store: "$store",
            //             customer : "$customer",
            //             quantity: 1,
            //             "product_details.product_name": 1,
            //             "store_details.store_name": 1,
            //             // "customer_details.first_name": 1,
            //             "customer_details.full_name": {
            //                 $concat: ["$customer_details.first_name", " ", "$customer_details.last_name"]
            //               }
            //         }
            //     }
            // ]);

            // console.log(salesListAgg);
            console.log(salesList);

            res.render('sales_display.ejs', {salesList: salesList});
        } catch (error) {
            console.log(error);
        };
    }


    // FIND BY ID
    // WHEN CLICK EDIT BUTTON IN SALESDISPLAY.EJS, OPEN EDIT PAGE
    static sales_edit = async (req, res) => {
        const sales_id = req.params.id;
        const salesInfoFromDb = sales_id != 0 ? await salesModel.findById(sales_id) : null;

        const storeList = await storeModel.find({});
        const productList = await productModel.find({});
        const customerList = await customerModel.find({});

        res.render("sales_edit", {
            sales: salesInfoFromDb,
            productList: productList,
            storeList: storeList,
            customerList: customerList
        });
    }

    // WHEN CLICK UPDATE BUTTON IN SALESEDIT.EJS, UPDATE THE SALES
    static sales_update = async (req, res) => {
        const sales_id = req.params.id;
        const updated_sales = req.body;

        salesModel.findByIdAndUpdate(sales_id, {
            sales_code: updated_sales.sales_code, 
            sales_date: updated_sales.sales_date, 
            sales_price: updated_sales.sales_price, 
            product: updated_sales.product, 
            store: updated_sales.store,
            customer: updated_sales.customer
        }).then((salesInfoFromDb) => {
            console.log("=========================== Sales has been updated successfully ==============================");
            console.log(salesInfoFromDb);
            res.redirect("/allsales");
        }).catch(error => {
            console.log(error);
        });
    }


    // WHEN CLICK INSERT BUTTON IN SALESEDIT.EJS, INSERT THE SALES
    static sales_insert = async (req, res) => {
        const insert_sales = req.body;

        salesModel.create({
            sales_code: insert_sales.sales_code, 
            sales_date: insert_sales.sales_date, 
            sales_price: insert_sales.sales_price, 
            product: insert_sales.product, 
            store: insert_sales.store,
            customer: insert_sales.customer
        }).then((salesInfoFromDb) => {
            console.log("=========================== Sales has been updated successfully ==============================");
            console.log(salesInfoFromDb);
            res.redirect("/allsales");
        }).catch(error => {
            console.log(error);
        });
    }


    // DELETE
    static sales_delete = async (req, res) => {
        const sales_id = req.params.id;

        salesModel.findByIdAndDelete(sales_id).then(() => {
            res.redirect("/allsales");
        }).catch(error => {
            console.log(error);
        });
    }
}

export default SalesController
