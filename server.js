import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport"; 

import "./config/passport.js"
import dbConnect from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRotes from "./routes/user.routes.js"
import expenseRoutes from "./routes/expense.routes.js";
import aiRoutes from "./routes/ai.routes.js";


dotenv.config();
dbConnect();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));
  
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRotes)
app.use("/api/expenses", expenseRoutes);

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "API is ready to roll" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
