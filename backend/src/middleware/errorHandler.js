import { AppError } from "../utils/AppError.js";

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const duplicateKeyMessage = (error) => {
  const fields = Object.keys(error.keyPattern || {}).join(", ");
  return fields ? `Duplicate value for ${fields}` : "Duplicate record";
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details;

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier supplied";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = duplicateKeyMessage(error);
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token is invalid or expired";
  }

  if (error.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    details = Object.values(error.errors).map((item) => item.message);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};