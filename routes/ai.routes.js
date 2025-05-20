import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getFinancialAdvice } from "../controllers/ai.controller.js"

const router = express.Router()

router.post("/advice",protect,getFinancialAdvice)

export default router