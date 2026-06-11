  import { userService } from "../services/userService.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getClientUrl } from "../utils/env.js";
import { authCookieOptions, signToken } from "../utils/jwt.js";

const safeRedirect = (state) => {
  const clientUrl = getClientUrl();

  if (!state) return `${clientUrl}/auth/success`;

  try {
    const decoded = decodeURIComponent(state);
    if (decoded.startsWith(clientUrl) || decoded.startsWith("/")) {
      return decoded.startsWith("/") ? `${clientUrl}${decoded}` : decoded;
    }
  } catch {
    return `${clientUrl}/auth/success`;
  }

  return `${clientUrl}/auth/success`;
};

export const authController = {
  googleCallback: catchAsync(async (req, res) => {
    const token = signToken(req.user);
    res.cookie("impeccable_token", token, authCookieOptions());

    const successUrl = new URL("/auth/success", getClientUrl());
    successUrl.searchParams.set("token", token);
    successUrl.searchParams.set("redirect", safeRedirect(req.query.state));

    res.redirect(successUrl.toString());
  }),

  me: catchAsync(async (req, res) => {
    const user = await userService.findById(req.user._id);
    res.json({ success: true, data: user });
  }),

  logout: catchAsync(async (_req, res) => {
    res.clearCookie("impeccable_token", authCookieOptions());
    res.json({ success: true, message: "Logged out" });
  }),
};