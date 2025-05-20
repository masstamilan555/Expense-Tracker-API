import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be atleast 6 characters long' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email' });
            return;
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "Mail already Exists !" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save()
        res.status(200).json({message:"User Created",user: {...newUser._doc,password:""}})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.error(error);

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send the token in a cookie
        res.cookie("masstoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        const plainUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            monthlyIncome: user.monthlyIncome,
            budgetLimit: user.budgetLimit,
        };

        res.status(200).json({ message: "Login successful", user: plainUser ,cookie: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        req.logout(() => {
            res.clearCookie("masstoken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
            res.status(200).json({ message: "Logged out successfully" });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Logout failed" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const token = req.cookies?.masstoken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
