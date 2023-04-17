// Importing modules
import PDFDocument from 'pdfkit';
import mongooseConnection from '../db.js';
import fs from 'fs';
import stockModel from '../models/stock.js';
import salesModel from '../models/sales.js';


// MongoDb Connection
mongooseConnection();

class PdfController {

    static pdfGeneratorForStoreQuery = async (req, res) => {
        // Create a document
        // Retrieve data based on query

        try {

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
                        total_quantity: 1
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
                        store_code: -1
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
                // doc.text('Top Selling Products for Each Store', 130, 220).moveDown();
                doc.text('The Least Remaining Product in Stock', 130, 190).moveDown();
                doc.text('in Each Store', 250, 230).moveDown();
            }

            const doc = new PDFDocument();

            // Send the PDF file as a response
            let pdfFile = './public/pdf/store.pdf';
            doc.pipe(fs.createWriteStream(pdfFile));

            // add the logo to the header
            addHeader(doc);

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

            // Set the response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="pdf/store.pdf"');

            pdfFile = '/pdf/store.pdf';
            res.redirect(pdfFile);

        } catch (error) {
            console.error(error);
        }
    }


    // The first three stores with the highest sales in the previous month and the total sales price
    static pdfGeneratorForTopThreeSalesInStoreQuery = async (req, res) => {
        try {
            const now = new Date();
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

            const salesListAgg = await salesModel.aggregate([
                {
                    $match: {
                        sales_date: {
                            $gte: startOfPreviousMonth,
                            $lte: endOfPreviousMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: "$store",
                        total_sales_price: {
                            $sum: "$sales_price"
                        }
                    }
                },
                {
                    $sort: {
                        total_sales_price: -1
                    }
                },
                {
                    $limit: 3
                }, {
                    $lookup: {
                        from: "stores",
                        localField: "_id",
                        foreignField: "_id",
                        as: "store"
                    }
                }, {
                    $project: {
                        _id: 0,
                        store_code: {
                            $arrayElemAt: ["$store.store_code", 0]
                        },
                        store_name: {
                            $arrayElemAt: ["$store.store_name", 0]
                        },
                        total_sales_price: 1
                    }
                }
            ]);
            console.log(salesListAgg);
            // add logo to header
            function addHeader(doc) {
                doc.image('./public/images/home-decor-logo.png', 205, 10, {
                    fit: [
                        200, 200
                    ],
                    align: 'center',
                    valign: 'center'
                });

                doc.fontSize(18);
                doc.text('Top three stores with the highest sales in previous month', 80, 230).moveDown();
            }

            const doc = new PDFDocument();

            // Send the PDF file as a response
            let pdfFile = './public/pdf/top_three_sales.pdf';
            doc.pipe(fs.createWriteStream(pdfFile));

            // add the logo to the header
            addHeader(doc);

            const headers = ["Store Code", "Store Name", "Total Sales Price"];

            // Set the width of each column
            const columnWidths = [150, 200, 100];

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

            salesListAgg.forEach((row, rowIndex) => {
                const {store_code, store_name, total_sales_price} = row;
                const rowValues = [store_code, store_name, total_sales_price];

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

            // Set the response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="pdf/top_three_sales.pdf"');

            pdfFile = '/pdf/top_three_sales.pdf';
            res.redirect(pdfFile);

        } catch (error) {
            console.error(error);
        }
    }


}
export default PdfController
