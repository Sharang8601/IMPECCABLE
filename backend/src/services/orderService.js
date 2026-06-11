import { orderRepository } from "../repositories/orderRepository.js";
import { serviceRepository } from "../repositories/serviceRepository.js";
import { AppError } from "../utils/AppError.js";

class OrderService {
  async createOrder(user, payload) {
    const serviceIds = payload.items.map((item) => item.serviceId);
    const services = await serviceRepository.find({ _id: { $in: serviceIds }, isActive: true });

    if (services.length !== new Set(serviceIds).size) {
      throw new AppError("One or more services are unavailable", 422);
    }

    const serviceMap = new Map(services.map((service) => [service._id.toString(), service]));

    const orderItems = payload.items.map((item) => {
      const service = serviceMap.get(item.serviceId);
      const lineTotal = service.price * item.quantity;

      return {
        service: service._id,
        title: service.title,
        image: service.image?.url || "",
        price: service.price,
        duration: service.duration,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    return orderRepository.create({
      user: user._id,
      customerName: user.name,
      customerEmail: user.email,
      customerAvatar: user.avatar,
      services: orderItems,
      totalAmount,
      status: "Pending",
      notes: payload.notes || "",
    });
  }

  listForAdmin() {
    return orderRepository.listForAdmin();
  }

  listForCustomer(userId) {
    return orderRepository.find({ user: userId }).sort({ createdAt: -1 });
  }

  async updateStatus(id, status) {
    const order = await orderRepository.updateById(id, { status });
    if (!order) throw new AppError("Order not found", 404);
    return order;
  }

  async dashboardStats() {
    const [totalOrders, pendingOrders] = await Promise.all([
      orderRepository.count(),
      orderRepository.count({ status: "Pending" }),
    ]);

    return { totalOrders, pendingOrders };
  }
}

export const orderService = new OrderService();