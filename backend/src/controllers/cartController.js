import { cartService } from "../services/cartService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const cartController = {
  get: catchAsync(async (req, res) => {
    const cart = await cartService.get(req.user._id);
    res.json({ success: true, data: cart });
  }),

  replace: catchAsync(async (req, res) => {
    const cart = await cartService.replace(req.user._id, req.validated.body.items);
    res.json({ success: true, data: cart });
  }),

  add: catchAsync(async (req, res) => {
    const cart = await cartService.add(req.user._id, req.validated.body);
    res.json({ success: true, data: cart });
  }),

  remove: catchAsync(async (req, res) => {
    const cart = await cartService.remove(req.user._id, req.params.serviceId);
    res.json({ success: true, data: cart });
  }),

  clear: catchAsync(async (req, res) => {
    const cart = await cartService.clear(req.user._id);
    res.json({ success: true, data: cart });
  }),
};