import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getUserProfile,updateBudget } from "../controllers/user.controller.js"
const router = express.Router()

router.get("/profile",protect,getUserProfile)
router.put("/budget",protect,updateBudget)

export default router