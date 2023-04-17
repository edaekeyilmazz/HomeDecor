// Importing modules
// import PDFDocument from 'pdfkit';
import PDFDocument from '/node_modules/pdfkit/js/pdfkit.js'
import mongooseConnection from '../../db.js';
import fs from 'fs';
import stockModel from '../../models/stock.js';
// import productModel from './models/product.js';



// MongoDb Connection
mongooseConnection();

const pdfGeneratorForStoreQuery = async () => {
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
        },{
            $group: {
                _id: {
                    store: "$store",
                    product: "$product"
                },
                store_code: {
                    $first: "$store_details.store_code"
                },
                product_name: {
                    $first: "$product_details.product_name"
                },
                product_code: {
                    $first: "$product_details.product_code"
                },
                total_quantity: {
                    $sum: "$quantity"
                }
            }
        }, {
            $sort: {
                "_id.store": 1,
                total_quantity: -1
            }
        }, {
            $group: {
                _id: "$_id.store",
                productDetails: {
                    $first: {
                        store_code: "$store_code",
                        product_code: "$product_code",
                        product_name: "$product_name",
                        total_quantity: "$total_quantity"
                    }
                }
            }
        }, {
            $project: {
                _id: 0,
                store_code: "$productDetails.store_code",
                product_code: "$productDetails.product_code",
                product_name: "$productDetails.product_name",
                quantity: "$productDetails.total_quantity"
            }
        }, {
            $sort: {
                "_id.store": 1,
                store_code: 1
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
        doc.text('Top Selling Products for Each Store', 130, 220).moveDown();
    }

    const doc = new PDFDocument();

    // add the logo to the header
    addHeader(doc);

    const file_name = 'stock.pdf';
    doc.pipe(fs.createWriteStream(`./public/pdf/${file_name}`));

    const headers = ["Store Code", "Product Code", "Product Name", "Quantity in Stock"];

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

    stockListAgg.forEach((row, rowIndex) => {
        const {store_code, product_code, product_name, quantity} = row;
        const rowValues = [store_code, product_code, product_name, quantity];

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

export default pdfGeneratorForStoreQuery
