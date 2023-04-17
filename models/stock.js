// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

import mongoose from "mongoose"
import productModel from "./product.js";
import storeModel from "./store.js";

//#region Stock MODEL
    const stockSchema = mongoose.Schema({
        quantity:{
            type: Number,
            require: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'store'
        }
    });
    const stockModel = mongoose.model("stock", stockSchema);
//#endregion Store MODEL

export default stockModel