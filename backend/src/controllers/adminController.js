import { dashboardService } from "../services/dashboardService.js";
import { userService } from "../services/userService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const adminController = {
  dashboard: catchAsync(async (_req, res) => {
    const stats = await dashboardService.getStats();
    res.json({ success: true, data: stats });
  }),

  customers: catchAsync(async (_req, res) => {
    const customers = await userService.listCustomers();
    res.json({ success: true, data: customers });
  }),
};