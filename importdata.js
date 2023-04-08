// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006


import productModel from './models/product.js';
import customerModel from './models/customer.js';
import storeModel from './models/store.js';
import salesModel from './models/sales.js';
import stockModel from './models/stock.js';
import csv from 'csvtojson';

console.log("Importing data is in progress...");

// #region Importing Product Data
const importProducts = () => {
    var productResponse;

    try {
        // Getting data from CSV file of Product
        csv().fromFile('./public/uploads/product.csv').then(async (response) => {
            for (var x = 0; x < response.length; x++) {
                productResponse = parseFloat(response[x].price)
                response[x].price = productResponse
            }

            // Adding product data from product.csv to MongoDb
            for (const product of response) {

                // If data already added to MongoDb, we didnt allow to add the duplicate product data.
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        // We are checking the data with product code existing in MongoDb or not
                        const existingProduct = await productModel.findOne({product_code: product.product_code});
                        // If not exist, we create a new Product data.
                        if (! existingProduct) {
                            const result = await productModel.create({
                                product_name: product.product_name,
                                product_code: product.product_code,
                                description: product.description,
                                price: product.price,
                                color: product.color,
                                brand: product.brand,
                                category: product.category
                            });
                            insertedDocument = result;
                        } else {
                            //If exist, we didnt add it
                            insertedDocument = existingProduct;
                        }
                    } catch (err) {
                        // If we get an error while adding data, we try to add it one more time. We try to add 3 times at total.
                        if (err.code === 11000 && err.keyPattern.product_code) { // Duplicate key error, retry after a short delay
                            console.log(`Duplicate product_code: ${
                                product.product_code
                            }. Retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            retryCount++;
                        } else { // Some other error occurred, re-throw the error
                            throw err;
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// #endregion Importing Product Data


// #region Importing Customer Data
const importCustomers = () => {
    try {
        // Getting data from CSV file of Customer
        csv().fromFile('./public/uploads/customer.csv').then(async (response) => {
            // Adding customer data from customer.csv to MongoDb
            for (const customer of response) {
                // If data already added to MongoDb, we didnt allow to add the duplicate customer data.
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        // We are checking the data with customer email existing in MongoDb or not
                        const existingCustomer = await customerModel.findOne({email: customer.email});
                        if (! existingCustomer) {
                            const result = await customerModel.create({
                                first_name: customer.first_name,
                                last_name: customer.last_name,
                                phone: customer.phone,
                                address: customer.address,
                                email: customer.email
                            });
                            insertedDocument = result;
                        } else {
                            //If exist, we didnt add it
                            insertedDocument = existingCustomer;
                        }
                    } catch (err) {
                        // If we get an error while adding data, we try to add it one more time. We try to add 3 times at total.
                        if (err.code === 11000 && err.keyPattern.email) { // Duplicate key error, retry after a short delay
                            console.log(`Duplicate customer email: ${
                                customer.email
                            }. Retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            retryCount++;
                        } else { // Some other error occurred, re-throw the error
                            throw err;
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}
// #endregion Importing Customer Data


// #region Importing Store Data
const importStores = () => {
    try {
        // Getting data from CSV file of Store
        csv().fromFile('./public/uploads/store.csv').then(async (response) => {
            // Adding store data from store.csv to MongoDb
            for (const store of response) {
                // If data already added to MongoDb, we didnt allow to add the duplicate store data.
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        // We are checking the data with store code existing in MongoDb or not
                        const existingStore = await storeModel.findOne({store_code: store.store_code});
                        // If not exist, we create a new Store data.
                        if (! existingStore) {
                            const result = await storeModel.create({
                                store_code: store.store_code,
                                store_name: store.store_name,
                                address: store.address,
                                phone: store.phone,
                                country: store.country,
                                postal_code: store.postal_code,
                                city: store.city
                            });
                            insertedDocument = result;
                        } else {
                            //If exist, we didnt add it
                            insertedDocument = existingStore;
                        }
                    } catch (err) {
                        // If we get an error while adding data, we try to add it one more time. We try to add 3 times at total.
                        if (err.code === 11000 && err.keyPattern.store_code) { // Duplicate key error, retry after a short delay
                            console.log(`Duplicate store_code: ${
                                store.store_code
                            }. Retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            retryCount++;
                        } else { // Some other error occurred, re-throw the error
                            throw err;
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}
// #endregion Importing Store Data


// #region Importing Sales Data
const importSales = () => {
    var salesResponse;

    try {
        // Getting data from CSV file of Sales
        csv().fromFile('./public/uploads/sales.csv').then(async (response) => {
            for (var x = 0; x < response; x++) {
                salesResponse = parseFloat(response[x].sales_price)
                response[x].sales_price = salesResponse
                salesResponse = new Date((response[x].sales_date)).toISOString()
                response[x].sales_date = salesResponse
            }

            // Adding sales data from sales.csv to MongoDb
            for (const sales of response) {

                // If data already added to MongoDb, we didnt allow to add the duplicate sales data.
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        // We are checking the data with sales code existing in MongoDb or not
                        const existingSales = await salesModel.findOne({sales_code: sales.sales_code});
                        // If not exist, we create a new Sales data.
                        if (! existingSales) {
                            const existingProduct = await productModel.findOne({product_code: sales.product});
                            const existingCustomer = await customerModel.findOne({email: sales.customer});
                            const existingStore = await storeModel.findOne({store_code: sales.store});

                            const result = await salesModel.create({
                                sales_code: sales.sales_code,
                                sales_date: sales.sales_date,
                                sales_price: sales.sales_price,
                                product: existingProduct.id,
                                customer: existingCustomer.id,
                                store: existingStore.id
                            });
                            insertedDocument = result;
                        } else {
                            //If exist, we didnt add it
                            insertedDocument = existingSales;
                        }
                    } catch (err) {
                        // If we get an error while adding data, we try to add it one more time. We try to add 3 times at total.
                        if (err.code === 11000 && err.keyPattern.sales_code) { // Duplicate key error, retry after a short delay
                            console.log(`Duplicate sales_code: ${
                                sales.sales_code
                            }. Retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            retryCount++;
                        } else { // Some other error occurred, re-throw the error
                            throw err;
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}
// #endregion Importing Sales Data


// #region Importing Stock Data
const importStocks = () => {
    var stockResponse;

    try {
        // Getting data from CSV file of Stock
        csv().fromFile('./public/uploads/stock.csv').then(async (response) => {
            for (var x = 0; x < response; x++) {
                stockResponse = parseFloat(response[x].quantity)
                response[x].quantity = stockResponse
            }

            // Adding stock data from stock.csv to MongoDb
            for (const stock of response) {
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {

                        const existingProduct = await productModel.findOne({product_code: stock.product});
                        const existingStore = await storeModel.findOne({store_code: stock.store});

                        const result = await stockModel.create({quantity: stock.quantity, product: existingProduct.id, store: existingStore.id});
                        insertedDocument = result;
                    } catch (err) {
                        // If we get an error while adding data, we try to add it one more time. We try to add 3 times at total.
                        if (err.code === 11000 && err.keyPattern.sales_code) { // Duplicate key error, retry after a short delay
                            console.log(`Retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            retryCount++;
                        } else { // Some other error occurred, re-throw the error
                            throw err;
                        }
                    }
                }
            }

        })
    } catch (error) {
        console.error(error);
    }
}
// #endregion Importing Stock Data

console.log("Importing data is done!");

export {
    importProducts,
    importCustomers,
    importStores,
    importSales,
    importStocks
}
