// Importing modules
import PDFDocument from 'pdfkit';
import mongooseConnection from './db.js';
import fs from 'fs';
import salesModel from './models/sales.js';
// import productModel from './models/product.js';


// MongoDb Connection
mongooseConnection();

const pdfGeneratorForSalesQuery = async () => {
    // Create a document
    // Retrieve data based on query
    const saleListAgg = await salesModel.aggregate([
       {
            $lookup: {
                from: 'customer',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer_details'
            }
        },{
            $unwind: "$customer_details"
        },{
            $group: {
                _id: {
                    // sales: "$sales",
                    customer: "$customer"
                },
                sales_code: {
                    $first: "$sales_code"
                },
                customer_email: {
                    $first: "$customer_details.customer_email"
                },
                sales_price: {
                    $first: "$sales_price"
                },
                sales_date: {
                    $first: "$sales_date"
                },
            }
        // }, {
        //     $sort: {
        //         "_id.sales": 1,
        //     }
        // }, {
        //     $group: {
        //         _id: "$_id.sale",
        //         productDetails: {
        //             $first: {
        //                 store_code: "$store_code",
        //                 customer_email: "$customer_email",
        //                 sales_price: "$sales_price",
        //                 sales_date: "$sales_date"
        //             }
        //         }
        //     }
        }, {
            $project: {
                _id: 0,
                sales_code: "$salesDetails.sales_code",
                customer_email: "$customerDetails.customer_email",
                sales_price: "$salesDetails.sales_price",
                sales_date: "$salesDetails.sales_date"
            }
        }, {
            $sort: {
                "_id.sales": 1,
                sales_code: 1
            }
        }
    ]);

    // add logo to header
    function addHeader(doc) {
        doc.image('./public/images/home-decor-logo.png', 205, 10, {
            fit: [
                200, 200
            ],
            align: 'center',
            valign: 'center'
        });

        doc.fontSize(22);
        doc.text(' Sales report for the last week', 130, 220).moveDown();
    }

    const doc = new PDFDocument();

    // add the logo to the header
    addHeader(doc);

    const file_name = 'sales.pdf';
    doc.pipe(fs.createWriteStream(`./public/pdf/${file_name}`));

    const headers = ["Sales Code", "Customer Email", "Sales Price", "Date"];

    // Set the width of each column
    const columnWidths = [100, 100, 200, 50];

    // Set the initial x and y positions of the table
    let x = 50;
    let y = 250;


    // Reset the x and y positions for the table data
    x = 80;
    y += 20;
    // Set cell styles
    const cellPadding = 5;
    const cellFont = 'Helvetica';
    const cellFontSize = 10;
    const cellFillColor = '#f9f9f9';
    const cellTextColor = '#333';
    const cellBorderWidth = 0.5;
    const cellBorderColor = '#ccc';
    doc.lineWidth(0.2);


    // Draw the table headers
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, index) => {
        const cellStyle = {
            fillColor: cellFillColor
        };
        // const cellStyle = { fillColor: '#f5f5f5' };
        doc.rect(x, y, columnWidths[index], 20).fill(cellStyle.fillColor);
        doc.font(cellFont).fontSize(cellFontSize).fill(cellTextColor);
        doc.text(header, x + cellPadding, y + cellPadding, {
            width: columnWidths[index] - cellPadding * 2,
            height: 20 - cellPadding * 2
        });
        doc.lineWidth(cellBorderWidth).rect(x, y, columnWidths[index], 20).stroke(cellBorderColor);
        x += columnWidths[index];
    });

    x = 80;
    y += 20;

    saleListAgg.forEach((row, rowIndex) => {
        const {sales_code, customer_email, sales_price, sales_date} = row;
        const rowValues = [sales_code, customer_email, sales_price, sales_date];

        rowValues.forEach((cell, columnIndex) => {
            const cellStyle = rowIndex % 2 === 0 ? {
                fillColor: cellFillColor
            } : {
                fillColor: '#f5f5f5'
            };
            doc.rect(x, y, columnWidths[columnIndex], 20).fill(cellStyle.fillColor);
            doc.font(cellFont).fontSize(cellFontSize).fill(cellTextColor);
            doc.text(cell.toString(), x + cellPadding, y + cellPadding, {
                width: columnWidths[columnIndex] - cellPadding * 2,
                height: 20 - cellPadding * 2
            });
            doc.lineWidth(cellBorderWidth).rect(x, y, columnWidths[columnIndex], 20).stroke(cellBorderColor);
            x += columnWidths[columnIndex];
        });
        x = 80;
        y += 20;
    });

    // Add the footer
    doc.page.margins = {
        'top': 50,
        'bottom': 20,
        'left': 50,
        'right': 50
    }

    doc.fontSize(10).text('copyright © Home Decor | Eda Ekeyilmaz 8823564 & Namitha Chevari 8817006', doc.page.margins.left + 80, doc.page.height - doc.page.margins.bottom - 30);

    doc.end();


}

export default pdfGeneratorForSalesQuery