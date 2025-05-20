import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFinancialAdvice = async (req, res) => {
  try {
    const { stats, catexp } = req.body;

    if (!catexp?.length) {
      return res.status(400).json({ message: "No category expenses provided. Please add expenses to get advice." });
    }

    const totalSpent = stats?.totalExpenses || catexp.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
    const categories = catexp.reduce((acc, exp) => {
      acc[exp._id] = exp.totalAmount || 0;
      return acc;
    }, {});

    // Find the highest spending category
    const topCategory = Object.entries(categories).reduce((a, b) => (b[1] > a[1] ? b : a), ["None", 0]);

    const prompt = `
      I am analyzing my monthly spending. My total spending is ₹${totalSpent}, and the category with the highest spending is "${topCategory[0]}" with ₹${topCategory[1]} spent.

      Based on this information:
      1. Provide a brief analysis of my spending.
      2. Give 3-5 practical and actionable financial tips to help me manage my expenses better.
      3. Suggest ways to reduce expenses in the "${topCategory[0]}" category.

      Please format the tips using bullet points and keep the advice simple and clear.
    `;

    // Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ 

      advice: text 
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI Analysis Failed" });
  }
};
