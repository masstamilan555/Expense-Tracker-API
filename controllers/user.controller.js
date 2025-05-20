import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error!" })
    }
}

export const updateBudget = async (req, res) => {
    try {
        const { monthlyIncome, budgetLimit } = req.body;
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.monthlyIncome = monthlyIncome || user.monthlyIncome;
        user.budgetLimit = budgetLimit || user.budgetLimit;
        await user.save();
        res.status(200).json({ message: "Budget updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error!" })
    }

}