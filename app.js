// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

import express from 'express'
import mongooseConnection from './db.js';
import router from "./routes/web.js";
import bodyParser from 'body-parser'
import PdfController from './controllers/pdfcontroller.js';
// import pdfGenerator  from './pdf_stock.js';
import pdfGeneratorForSalesQuery  from './pdf_sales.js';

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

app.use('/',router)
