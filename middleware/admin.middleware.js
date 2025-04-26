

import User from '../model/user.model.js';

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in req.user after
    const user = await User.findById(userId);// Fetch the user role from the database
    if (!user) { 
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
