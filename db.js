import mongoose from "mongoose"

mongoose.set('strictQuery', true);

const uri ="mongodb+srv://eekeyilmaz:Eda123@cluster0.wmufeqn.mongodb.net/DriveTestDb?retryWrites=true&w=majority";
const mongooseConnection = () => mongoose.connect(uri,
{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => { 
console.log("MongoDb connects successfully!!");
}).catch((error)=>{
    console.log(error)
})

export default mongooseConnection;