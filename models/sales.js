import mongoose from "mongoose"
import customerModel from "./customer.js";
import productModel from "./product.js";
import storeModel from "./store.js";

//#region Sales MODEL
    const salesSchema = mongoose.Schema({
        sales_code:{
            type: String,
            require: true
        },
        sales_date:{
            type: Date,
            require: true
        },
        sales_price:{
            type: Number,
            require: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customerModel'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel'
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'storeModel'
        }
    });
    const salesModel = mongoose.model("sales", salesSchema);
//#endregion Sales MODEL

export default salesModel