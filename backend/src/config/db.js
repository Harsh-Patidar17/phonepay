import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongodb connected successfully');        
    } catch (error) {
        console.log('Error connecting to mongodb', error);
    }
}
export default connectDB;



