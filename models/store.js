// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

import mongoose from "mongoose"

//#region Store MODEL
    const storeSchema = mongoose.Schema({
        store_code:{
            type: String,
            require: true,
            unique: true
        },
        store_name:{
            type: String,
            require: true
        },
        address:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            default: true
        },
        country:{
            type: String
        },
        postal_code:{
            type: String
        },
        city:{
            type: String
        }
    });
    const storeModel = mongoose.model("store", storeSchema);
//#endregion Store MODEL

export default storeModel