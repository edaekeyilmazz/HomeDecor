// Importing modules
import PDFDocument from 'pdfkit';
import mongooseConnection from './db.js';
import fs from 'fs';
import stockModel from './models/stock.js';
// import productModel from './models/product.js';


// MongoDb Connection
mongooseConnection();

const pdfGeneratorForStockQuery = async () => {
    // Create a document
    // Retrieve data based on query
    const stockListAgg = await stockModel.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product_details'
            }
        },
        {
            $lookup: {
                from: 'stores',
                localField: 'store',
                foreignField: '_id',
                as: 'store_details'
            }
        },
        {
            $unwind: "$product_details"
        },
        {
            $unwind: "$store_details"
        }, {
            $project: {
                id: "$_id",
                product: "$product",
                store: "$store",
                quantity: 1,
                "product_details.product_name": 1,
                "product_details.product_code": 1,
                "store_details.store_name": 1,
                "store_details.store_code": 1
            }
        },
        {
            $group: {
              _id: "$store",
              stockList: {
                $push: {
                  id: "$id",
                  product: "$product",
                  quantity: "$quantity",
                  store_code: "$store_details.store_code",
                  store_name: "$store_details.store_name",
                  product_name: "$product_details.product_name",
                  product_code: "$product_details.product_code"
                }
              }
            }
          }
    ]);

    // add logo to header
    function addHeader(doc) {
        doc
        .image('./public/images/home-decor-logo.png', 270, 10, {
            fit: [100, 100],
            align: 'center',
            valign: 'center'
        });

        doc.fontSize(22);
        doc.text('Low Stock Products', 220, 100)
        .moveDown();
    }

    const doc = new PDFDocument();

    // add the logo to the header
    addHeader(doc);

    // PageNumber not working correctly, check it
    doc.on('pageAdded', () => {
        const pageNumber = doc.pageNumber;
        doc.fontSize(10)
          .text(`Page ${pageNumber}`, 0, 750, { align: 'center' });
      });

      const file_name = 'stock.pdf';
      doc.pipe(fs.createWriteStream(`./public/pdf/${file_name}`));

      const headers = ["Store Code", "Product Code", "Product Name", "Quantity in Stock"];


    // Loop through the query results and add the data to the table
    const tableData = stockListAgg.map((item) => {
        const returnList = [];
        item.stockList.forEach(stock => {
            returnList.push(
                stock.store_code,
                stock.product_code,
                stock.product_name,
                stock.quantity
            );
        })
        console.log(returnList);
        return returnList;
    });


    // Set the width of each column
    const columnWidths = [100, 100, 200, 50];

    // Set the initial x and y positions of the table
    let x = 50;
    let y = 200;

    // Draw the table headers
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, index) => {
        doc.text(header, x, y);
        x += columnWidths[index];
    });

    // Reset the x and y positions for the table data
    x = 50;
    y += 20;

    // Draw the table data
    doc.font('Helvetica').fontSize(10);
    tableData.forEach((row) => {
        row.forEach((cell, index) => {
            doc.text(cell.toString(), x, y);
            x += columnWidths[index];
        });
        x = 50;
        y += 20;
    });


    // Add the footer
        doc.fontSize(10)
        .text('Page ' + doc.pageNumber, doc.page.margins.left + 200, doc.page.height - 90);

    doc.end();


}

export default pdfGeneratorForStockQuery
