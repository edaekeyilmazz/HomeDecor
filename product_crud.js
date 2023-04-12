import productModel from './models/product.js';


//#region CRUD METHODS

// GET ALL
app.get('/allproducts', function(req, res){
    productModel.find({},(error,productList) => {
        if (error) {
            console.log(error);
        }
        else{
            console.log("====================== All Products from Db ==========================");
            console.log(productList);
            res.render('product_display.ejs', { productList: productList });
        }
    });
});


// INSERT
// app.get('/insert_product/:id', function(req, res){
// employeeModel.create({
//     name: "Mark",
//     contact: "548-222-2222",
//     city: "Kitchener",
//     job: "Software Developer",
//     salary: 120000
// }, (error, employee_inserted) => {
//     if (error) {
//         console.log(error);
//     }
//     else{
//         console.log(employee_inserted);
//     }
// });
// });


// FIND BY ID
// WHEN CLICK EDIT BUTTON IN DISPLAY.EJS, OPEN EDIT PAGE
app.get('/product_edit/:id', function(req, res){

    const employee_id = req.params.id;

    employeeModel.findById(employee_id, (error, updatedEmployee) => {
        if (error) {
            console.log(error);
        }
        else{
            console.log("=========================== Employee has been updated successfully ==============================");
            console.log(updatedEmployee);
            res.render("edit", { employee: updatedEmployee });
        }
    });
});



app.post('/product_update/:id', function(req, res){

    const employee_id = req.params.id;
    const updated_employee = req.body;

    employeeModel.findByIdAndUpdate(employee_id, 
        {
            name: updated_employee.name,
            contact: updated_employee.contact,
            city: updated_employee.city,
            job: updated_employee.job,
            salary: updated_employee.salary,
        },
         (error, updatedEmployeeFromDb) => {
        if (error) {
            console.log(error);
        }
        else{
            console.log("=========================== Employee has been updated successfully ==============================");
            console.log(updatedEmployeeFromDb);
            res.redirect("/all");
        }
    });
});



// DELETE
app.get('/delete/:id', function(req, res){

    const employee_id = req.params.id;
    employeeModel.findByIdAndDelete(employee_id, (error, deletedEmployee) => {
        if (error){
            console.log(error);
        }
        else{
            console.log("=========================== Employee has been deleted successfully ==============================");
            console.log(deletedEmployee);
            res.redirect("/all");
        }
    });
});
//#endregion CRUD METHODS