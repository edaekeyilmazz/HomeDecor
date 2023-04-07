import productModel from './models/product.js';
import customerModel from './models/customer.js';
import storeModel from './models/store.js';
import salesModel from './models/sales.js';
import stockModel from './models/stock.js';
import csv from 'csvtojson';

// #region Importing Product Data
const importProducts = () => {
    var productResponse;

    try {
        csv().fromFile('./public/uploads/product.csv').then(async (response) => {
            for (var x = 0; x < response.length; x++) {
                productResponse = parseFloat(response[x].price)
                response[x].price = productResponse
            }

            for (const product of response) {
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {

                        const existingProduct = await productModel.findOne({product_code: product.product_code});
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
                            insertedDocument = existingProduct;
                        }
                    } catch (err) {
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
        csv().fromFile('./public/uploads/customer.csv').then(async (response) => {
            for (const customer of response) {
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
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
                            insertedDocument = existingCustomer;
                        }
                    } catch (err) {
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
    var storeResponse;

    try {
        csv().fromFile('./public/uploads/store.csv').then(async (response) => {
            for (const store of response) {
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        const existingStore = await storeModel.findOne({store_code: store.store_code});
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
                            insertedDocument = existingStore;
                        }
                    } catch (err) {
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
        csv().fromFile('./public/uploads/sales.csv').then(async (response) => {
            for (var x = 0; x < response; x++) {
                salesResponse = parseFloat(response[x].sales_price)
                response[x].sales_price = salesResponse
                salesResponse = new Date((response[x].sales_date)).toISOString()
                response[x].sales_date = salesResponse
            }

            for (const sales of response) {
                let insertedDocument = null;
                let retryCount = 0;
                const MAX_RETRY = 3; // Maximum number of retries

                while (! insertedDocument && retryCount < MAX_RETRY) {
                    try {
                        const existingSales = await salesModel.findOne({sales_code: sales.sales_code});
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
                            insertedDocument = existingSales;
                        }
                    } catch (err) {
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
        csv().fromFile('./public/uploads/stock.csv').then(async (response) => {
            for (var x = 0; x < response; x++) {
                stockResponse = parseFloat(response[x].quantity)
                response[x].quantity = stockResponse
            }

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


export {
    importProducts,
    importCustomers,
    importStores,
    importSales,
    importStocks
}
