// Importing modules
import PDFDocument from 'pdfkit'
import fs from 'fs'

const pdfGenerator = () => { // Create a document
    const doc = new PDFDocument();

    // Saving the pdf file in root directory.
    const file_name = 'example.pdf';
    doc.pipe(fs.createWriteStream(`./public/pdf/${file_name}`));


    // Adding an image in the pdf.

    doc.image('./public/images/conestogalogo.png', {
        fit: [
            100, 100
        ],
        align: 'center',
        valign: 'center'
    });

    // Adding functionality
    // doc.fontSize(22).text('This the article for GeeksforGeeks', 100, 100);

    doc.addPage().fontSize(15).text('Generating PDF with the help of pdfkit', 100, 100);


    // Apply some transforms and render an SVG path with the
    // 'even-odd' fill rule
    doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();

    // // Add some text with annotations
    // doc
    // .addPage()
    // .fillColor('blue')
    // .text('The link for GeeksforGeeks website', 100, 100)
    // .link(100, 100, 160, 27, {
    //     url: `./pdf/${file_name}`,
    //     target: '_blank'
    // });
    // console.log(`./pdf/${file_name}`);
    // Finalize PDF file



    // Add the invoice header
    doc.fontSize(20).text("Invoice", { align: "center" }).moveDown(0.5);
    doc.fontSize(12).text("Date: 2023-04-03", { align: "right" });
    doc.moveDown();

    // Add the item details
    doc.fontSize(16).text("Item Details", { underline: true }).moveDown();
    doc.fontSize(12);
    doc.text("Year: 2023").moveDown();
    doc.text("Brand: Toyota").moveDown();
    doc.text("Model: Camry").moveDown();
    doc.text("Category: Engine").moveDown();
    doc.text("Item: Air Filter").moveDown();
    doc.text("Price: $20.00").moveDown();
    doc.text("Quantity: 2").moveDown();
    doc.text("Total: $40.00").moveDown();

    // Add the order summary
    doc.fontSize(16).text("Order Summary", { underline: true }).moveDown();
    doc.fontSize(12);
    doc.text("Subtotal: $40.00").moveDown();
    doc.text("Tax: $2.00").moveDown();
    doc.text("Shipping: Free").moveDown();
    doc.fontSize(14).text("Total: $42.00", { bold: true }).moveDown();



    doc.end();

}

export default pdfGenerator
