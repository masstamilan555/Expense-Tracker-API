import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully");
        
    } catch (err) {
        console.error(err);

    }
}

export default dbConnect