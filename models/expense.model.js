import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Others"] },
    description: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);;
