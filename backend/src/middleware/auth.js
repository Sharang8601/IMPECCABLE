import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

const extractToken = (req) => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  return req.cookies?.impeccable_token || null;
};

export const protect = async (req, _res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.sub);

    if (!user || !user.isActive) {
      throw new AppError("User account is not available", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  return next();
};