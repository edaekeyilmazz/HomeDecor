import mongoose from "mongoose"

//#region Customer MODEL
    const customerSchema = mongoose.Schema({
        first_name:{
            type: String,
            require: true
        }, 
        last_name:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            require: true
        },
        address:{
            type: String,
            require: true
        },
        email:{
            type: String,
            require: true,
            unique: true
        }
    });
    const customerModel = mongoose.model("customer", customerSchema);
//#endregion Customer MODEL

export default customerModel
