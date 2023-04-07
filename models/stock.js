import mongoose from "mongoose"
import productModel from "./product";
import storeModel from "./store";

//#region Stock MODEL
    const stockSchema = mongoose.Schema({
        quantity:{
            type: Number,
            require: true
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
    const stockModel = mongoose.model("stock", stockSchema);
//#endregion Store MODEL

export default stockModel