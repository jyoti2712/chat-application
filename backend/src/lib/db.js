import mongoose from "mongoose";

export const connectdb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${conn.connection.host}`);
    }
    catch (err){
        console.log("Mongodb connection error" , err);
    }
}