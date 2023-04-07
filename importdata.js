import productModel from './models/product.js';
import customerModel from './models/customer.js';
import storeModel from './models/store.js';
import salesModel from './models/sales.js';
import stockModel from './models/stock.js';
import csv from 'csvtojson';

//#region Importing Product Data 
let productIds = [];
const importProducts = () => {
    var productResponse;

    try {
        csv()
            .fromFile('./public/uploads/product.csv')
            .then(async (response) => {
                for (var x = 0; x < response; x++) {
                    // productResponse = parseFloat(response[x].product_name)
                    // response[x].product_name = productResponse
                    // productResponse = parseFloat(response[x].product_code)
                    // response[x].product_code = productResponse
                    // productResponse = parseFloat(response[x].description)
                    // response[x].description = productResponse
                    productResponse = parseFloat(response[x].price)
                    response[x].price = productResponse
                    // productResponse = parseFloat(response[x].color)
                    // response[x].color = productResponse
                    // productResponse = parseFloat(response[x].brand)
                    // response[x].brand = productResponse
                    // productResponse = parseFloat(response[x].category)
                    // response[x].category = productResponse
                }
                console.log(productResponse);
                
                // productModel.insertMany(response)
                // .then((return_data)=>{
                //     console.log(return_data);  
                // }).catch((error)=>{
                //     console.log(error);
                // });
                for (const product of response) {
                        const existingProduct = await productModel.findOne({ product_code: product.product_code });
                        if (!existingProduct) {
                            const result = await productModel.create({
                                product_name: product.product_name,
                                product_code: product.product_code,
                                description: product.description,
                                price: product.price,
                                color: product.color,
                                brand: product.brand,
                                category: product.category
                            });
                            productIds.push(result.insertedId);
                        }
                        else{
                            productIds.push(existingProduct._id);
                        }
                    }
                console.log("productIds: " + productIds)
            })
        } 
        catch (error) {
            console.error(error);
    }
}
//#endregion Importing Product Data


//#region Importing Customer Data 
const importCustomers = () => {
    var customerResponse;

    try {
        csv()
            .fromFile('./public/uploads/customer.csv')
            .then((response) => {
                for (var x = 0; x < response; x++) {
                    customerResponse = parseFloat(response[x].first_name)
                    response[x].first_name = customerResponse
                    customerResponse = parseFloat(response[x].last_name)
                    response[x].last_name = customerResponse
                    customerResponse = parseFloat(response[x].phone)
                    response[x].phone = customerResponse
                    customerResponse = parseFloat(response[x].address)
                    response[x].address = customerResponse
                    customerResponse = parseFloat(response[x].email)
                    response[x].email = customerResponse
                }
                
                customerModel.insertMany(response)
                .then((return_data)=>{
                    console.log(return_data);  
                }).catch((error)=>{
                    console.log(error);
                });
            })
        } 
        catch (error) {
            console.error(error);
    }
}
//#endregion Importing Customer Data


//#region Importing Store Data 
const importStores = () => {
    var storeResponse;

    try {
        csv()
            .fromFile('./public/uploads/store.csv')
            .then((response) => {
                for (var x = 0; x < response; x++) {
                    storeResponse = parseFloat(response[x].store_code)
                    response[x].store_code = storeResponse
                    storeResponse = parseFloat(response[x].store_name)
                    response[x].store_name = storeResponse
                    storeResponse = parseFloat(response[x].address)
                    response[x].address = storeResponse
                    storeResponse = parseFloat(response[x].phone)
                    response[x].phone = storeResponse
                    storeResponse = parseFloat(response[x].country)
                    response[x].country = storeResponse
                    storeResponse = parseFloat(response[x].postal_code)
                    response[x].postal_code = storeResponse
                    storeResponse = parseFloat(response[x].city)
                    response[x].city = storeResponse
                }
                
                storeModel.insertMany(response)
                .then((return_data)=>{
                    console.log(return_data);  
                }).catch((error)=>{
                    console.log(error);
                });
            })
        } 
        catch (error) {
            console.error(error);
    }
}
//#endregion Importing Store Data


//#region Importing Sales Data 
const importSales = () => {
    var salesResponse;

    try {
        csv()
            .fromFile('./public/uploads/sales.csv')
            .then((response) => {
                for (var x = 0; x < response; x++) {
                salesResponse = parseFloat(response[x].product_name)
                response[x].product_name = salesResponse
                salesResponse = parseFloat(response[x].product_code)
                response[x].product_code = salesResponse
                salesResponse = parseFloat(response[x].description)
                response[x].description = salesResponse
                salesResponse = parseFloat(response[x].price)
                response[x].price = salesResponse
                salesResponse = parseFloat(response[x].color)
                response[x].color = salesResponse
                salesResponse = parseFloat(response[x].brand)
                response[x].brand = salesResponse
                salesResponse = parseFloat(response[x].category)
                response[x].category = salesResponse
                }
                
                salesModel.insertMany(response)
                .then((return_data)=>{
                    console.log(return_data);  
                }).catch((error)=>{
                    console.log(error);
                });
            })
        } 
        catch (error) {
            console.error(error);
    }
}
//#endregion Importing Sales Data


//#region Importing Stock Data 
const importStocks = () => {
    var stockResponse;

    try {
        csv()
            .fromFile('./public/uploads/product.csv')
            .then((response) => {
                for (var x = 0; x < response; x++) {
                stockResponse = parseFloat(response[x].product_name)
                response[x].product_name = stockResponse
                stockResponse = parseFloat(response[x].product_code)
                response[x].product_code = stockResponse
                stockResponse = parseFloat(response[x].description)
                response[x].description = stockResponse
                stockResponse = parseFloat(response[x].price)
                response[x].price = stockResponse
                stockResponse = parseFloat(response[x].color)
                response[x].color = stockResponse
                stockResponse = parseFloat(response[x].brand)
                response[x].brand = stockResponse
                stockResponse = parseFloat(response[x].category)
                response[x].category = stockResponse
                }
                
                stockModel.insertMany(response)
                .then((return_data)=>{
                    console.log(return_data);  
                }).catch((error)=>{
                    console.log(error);
                });
            })
        } 
        catch (error) {
            console.error(error);
    }
}
//#endregion Importing Stock Data


export {
    importProducts,
    importCustomers,
    importStores,
    importSales,
    importStocks
}
