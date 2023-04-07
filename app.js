import express from 'express'
import mongooseConnection from './db.js';
import {
    importProducts,
    importCustomers,
    importStores,
    importSales,
    importStocks
} from './importdata.js';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))

mongooseConnection();

app.listen(6406, () => {
    console.log('App is listening at port 6406!');
});

// #region IMPORTING DATA
importProducts();
importCustomers();
importStores();
importSales();
importStocks();
// #endregion IMPORTING DATA


// #region VIEWS
// Default
app.get('/', function (req, res) {
    res.render('product.ejs');
});

// Customer
app.get('/customer', function (req, res) {
    res.render('customer.ejs');
});

// Product
app.get('/product', function (req, res) {
    res.render('product.ejs');
});

// Stock
app.get('/stock', function (req, res) {
    res.render('stock.ejs');
});
// #endregion VIEWS
