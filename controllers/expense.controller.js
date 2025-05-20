import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import mongoose from "mongoose";
export const addExpense = async (req, res) => {
    try {
        const { amount, category, description } = req.body

        if (!amount || !category) return res.status(400).json({ message: "Amount and Category must required" })

        const newExpense = new Expense({
            user: req.user.id,
            amount,
            category,
            description
        })
        await newExpense.save()
        res.status(200).json({ message: "Expense added successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error!" })

    }
}

//get all expenses of user
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        
        res.status(200).json({ data:expenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// delete a expense by id
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id);

        if (!expense) return res.status(404).json({ message: "Expense not found" });

        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await expense.deleteOne();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//get expense by category
export const getExpensesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const expenses = await Expense.find({ user: req.user.id, category });

        res.status(200).json({ expenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//update expense
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;

     
        const expense = await Expense.findById(id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });

        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description || expense.description;
        expense.date = date || expense.date;

        await expense.save();
        res.status(200).json({ message: "Expense updated successfully", expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// get monthly expense , savings , income
export const getMonthlyExpenses = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const totalExpenses = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);


        const thisMonthExpenses = totalExpenses[0]?.totalAmount || 0;

        const user = await User.findById(userId);
        const monthlyIncome = user?.monthlyIncome || 0;


        const remainingBalance = monthlyIncome - thisMonthExpenses;

        res.status(200).json({
            totalExpenses: thisMonthExpenses,
            monthlyIncome,
            remainingBalance
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// get category expense sum 
export const getCategoryWiseExpenses = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
console.log(userId)
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const categoryExpenses = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({data:categoryExpenses});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
