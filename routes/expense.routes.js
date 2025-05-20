import express from "express"

import protect from "../middleware/authMiddleware.js";
import { addExpense,getExpenses,deleteExpense,getExpensesByCategory,updateExpense ,getMonthlyExpenses, getCategoryWiseExpenses} from "../controllers/expense.controller.js";

const router = express.Router()

router.post("/create", protect, addExpense);
router.get("/all-expenses", protect, getExpenses);
router.put("/:id", protect, updateExpense); 
router.delete("/:id", protect, deleteExpense);
router.get("/category/:category", protect, getExpensesByCategory);
router.get("/monthly-expenses", protect, getMonthlyExpenses);
router.get("/category-wise-expenses", protect, getCategoryWiseExpenses);


export default router