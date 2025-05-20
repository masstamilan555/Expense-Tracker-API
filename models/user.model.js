import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String},
    email : {type:String,unique:true,required:true},
    password:{type:String},
    googleId:{type:String},
    monthlyIncome: { type: Number, default: 0 }, 
    budgetLimit: { type: Number, default: 0 }
},{timestamps:true})

export default mongoose.model('User',userSchema)