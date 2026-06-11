import jwt from "jsonwebtoken";

const jwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return process.env.JWT_SECRET;
};

export const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    jwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

export const verifyToken = (token) => jwt.verify(token, jwtSecret());

export const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000,
});