import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization &&
        req.headers.authorization.replace("Bearer ", ""));

    if (!token) {
      return res.status(401).json({ message: "Access token not provided" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.json({ token });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle errors
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Invalid access token" });
  }
};

export { verifyJWT };
