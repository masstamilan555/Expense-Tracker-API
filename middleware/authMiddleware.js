import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    try {
        // Check for Google OAuth session
        if (req.user) {
            return next();
        }

        // Check for JWT from cookies
        const token = req.cookies?.masstoken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

export default protect;
