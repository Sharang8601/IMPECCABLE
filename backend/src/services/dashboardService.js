import { categoryRepository } from "../repositories/categoryRepository.js";
import { serviceRepository } from "../repositories/serviceRepository.js";
import { userService } from "./userService.js";
import { orderService } from "./orderService.js";

class DashboardService {
  async getStats() {
    const [totalServices, totalCategories, customers, orderStats] = await Promise.all([
      serviceRepository.count(),
      categoryRepository.count(),
      userService.countCustomers(),
      orderService.dashboardStats(),
    ]);

    return {
      totalServices,
      totalCategories,
      totalSubCategories: 0,
      totalCustomers: customers,
      totalOrders: orderStats.totalOrders,
      pendingOrders: orderStats.pendingOrders,
    };
  }
}

export const dashboardService = new DashboardService();