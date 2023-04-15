// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

import express from 'express'
import mongooseConnection from './db.js';
import router from "./routes/web.js";
import bodyParser from 'body-parser'
import pdfGenerator  from './pdf.js';

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

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     
    limit: '200mb',
    extended: true
}));

// MongoDb Connection
mongooseConnection();

app.listen(6406, () => {
    console.log('App is listening at port 6406!');
});

// #region IMPORTING DATA
// importProducts();
// importCustomers();
// importStores();
// importSales();
// importStocks();
// #endregion IMPORTING DATA

pdfGenerator();

app.use('/',router)

// // #region VIEWS
// // Home
// app.get('/', function (req, res) {
//     res.render('home.ejs');
// });

// // Customer
// app.get('/customer', function (req, res) {
//     res.render('customer.ejs');
// });

// // Product
// app.get('/product', function (req, res) {
//     res.render('product.ejs');
// });

// // Stock
// app.get('/stock', function (req, res) {
//     res.render('stock.ejs');
// });
// // #endregion VIEWS
