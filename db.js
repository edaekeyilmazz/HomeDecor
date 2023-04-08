// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

import mongoose from "mongoose"

mongoose.set('strictQuery', true);

// Connection Url
const uri ="mongodb+srv://dataqueen:123@dataqueen.uu0lrca.mongodb.net/DataQueens_HomeDecorDb?retryWrites=true&w=majority";

// MongoDb Connection
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