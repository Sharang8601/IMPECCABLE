import { orderService } from "../services/orderService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const orderController = {
  create: catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.user, req.validated.body);
    res.status(201).json({ success: true, data: order });
  }),

  myOrders: catchAsync(async (req, res) => {
    const orders = await orderService.listForCustomer(req.user._id);
    res.json({ success: true, data: orders });
  }),

  listAdmin: catchAsync(async (_req, res) => {
    const orders = await orderService.listForAdmin();
    res.json({ success: true, data: orders });
  }),

  updateStatus: catchAsync(async (req, res) => {
    const order = await orderService.updateStatus(req.validated.params.id, req.validated.body.status);
    res.json({ success: true, data: order });
  }),
};