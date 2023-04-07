import mongoose from "mongoose"

//#region Product MODEL
    const productSchema = mongoose.Schema({
        product_name:{
            type: String,
            require: true
        },
        product_code:{
            type: String,
            require: true,
            unique: true
        },
        description:{
            type: String
        },
        price:{
            type: Number,
            require: true
        },
        color:{
            type: String
        },
        brand:{
            type: String,
            require: true
        },
        category:{
            type: String,
            require: true
        }
    });
    const productModel = mongoose.model("product", productSchema);
//#endregion Product MODEL

export default productModel