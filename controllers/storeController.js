import storeModel from '../models/store.js';

class StoreController {

    // #region CRUD METHODS

    // GET ALL
    static allstores = async (req, res) => {
        try {
            const storeList = await storeModel.find({});
            console.log(storeList);
            res.render('store_display.ejs', {storeList: storeList});
        } catch (error) {
            console.log(error);
        };
    }


    // FIND BY ID
    // WHEN CLICK EDIT BUTTON IN STOREDISPLAY.EJS, OPEN EDIT PAGE
    static store_edit = async (req, res) => {
        const store_id = req. params.id;
        const storeInfoFromDb = store_id != 0 ? await storeModel.findById(store_id): null;
        res.render("store_edit", { store: storeInfoFromDb });
    }

    // WHEN CLICK UPDATE BUTTON IN STOREEDIT.EJS, UPDATE THE STORE
    static store_update = async (req, res) => {
        const store_id = req.params.id;
        const updated_store = req.body;

        storeModel.findByIdAndUpdate(store_id, {
            store_code: updated_store.store_code,
            store_name: updated_store.store_name,
            address: updated_store.address,
            phone: updated_store.phone,
            country: updated_store.country,
            postal_code: updated_store.postal_code,
            city: updated_store.city
        }).then((storeInfoFromDb) => {
            console.log("=========================== Store has been updated successfully ==============================");
            console.log(storeInfoFromDb);
            res.redirect("/allstores");
        }).catch(error => {
            console.log(error);
        });
    }


     // WHEN CLICK INSERT BUTTON IN STOREEDIT.EJS, INSERT THE STORE
     static store_insert = async (req, res) => {
        const insert_store = req.body;

        storeModel.create({
            store_code: insert_store.store_code,
            store_name: insert_store.store_name,
            address: insert_store.address,
            phone: insert_store.phone,
            country: insert_store.country,
            postal_code: insert_store.postal_code,
            city: insert_store.city
        }).then((storeInfoFromDb) => {
            console.log("=========================== Store has been updated successfully ==============================");
            console.log(storeInfoFromDb);
            res.redirect("/allstores");
        }).catch(error => {
            console.log(error);
        });
    }


    // DELETE
    static store_delete = async (req, res) => {
        const store_id = req.params.id;

        storeModel.findByIdAndDelete(store_id).then(() => {
            res.redirect("/allstores");
        }).catch(error => {
            console.log(error);
        });
    }
}

export default StoreController
