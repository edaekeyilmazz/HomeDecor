import customerModel from '../models/customer.js';

class CustomerController {

    // #region CRUD METHODS

    // GET ALL
    static allcustomers = async (req, res) => {
        try {
            const customerList = await customerModel.find({});
            console.log(customerList);
            res.render('customer_display.ejs', {customerList: customerList});
        } catch (error) {
            console.log(error);
        };
    }


    // FIND BY ID
    // WHEN CLICK EDIT BUTTON IN CUSTOMERDISPLAY.EJS, OPEN EDIT PAGE
    static customer_edit = async (req, res) => {
        const customer_id = req. params.id;
        const customerInfoFromDb = customer_id != 0 ? await customerModel.findById(customer_id): null;
        console.log(customerInfoFromDb != null ? customerInfoFromDb.customer_name : '' );
        res.render("customer_edit", { customer: customerInfoFromDb });
    }

    // WHEN CLICK UPDATE BUTTON IN CUSTOMEREDIT.EJS, UPDATE THE CUSTOMER
    static customer_update = async (req, res) => {
        const customer_id = req.params.id;
        const updated_customer = req.body;

        customerModel.findByIdAndUpdate(customer_id, {
            first_name: updated_customer.first_name,
            last_name: updated_customer.last_name,
            phone: updated_customer.phone,
            address: updated_customer.address,
            email: updated_customer.email
        }).then((customerInfoFromDb) => {
            console.log("=========================== Customer has been updated successfully ==============================");
            console.log(customerInfoFromDb);
            res.redirect("/allcustomers");
        }).catch(error => {
            console.log(error);
        });
    }


     // WHEN CLICK INSERT BUTTON IN CUSTOMEREDIT.EJS, INSERT THE CUSTOMER
     static customer_insert = async (req, res) => {
        const insert_customer = req.body;

        customerModel.create({
            first_name: insert_customer.first_name,
            last_name: insert_customer.last_name,
            phone: insert_customer.phone,
            address: insert_customer.address,
            email: insert_customer.email
        }).then((customerInfoFromDb) => {
            console.log("=========================== Customer has been updated successfully ==============================");
            console.log(customerInfoFromDb);
            res.redirect("/allcustomers");
        }).catch(error => {
            console.log(error);
        });
    }


    // DELETE
    static customer_delete = async (req, res) => {
        const customer_id = req.params.id;

        customerModel.findByIdAndDelete(customer_id).then(() => {
            res.redirect("/allcustomers");
        }).catch(error => {
            console.log(error);
        });
    }
}

export default CustomerController
