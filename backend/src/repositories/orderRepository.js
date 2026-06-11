import { Order } from "../models/Order.js";
import { BaseRepository } from "./BaseRepository.js";

class OrderRepository extends BaseRepository {
  listForAdmin(filter = {}) {
    return this.model.find(filter).populate("user", "name email avatar role").sort({ createdAt: -1 });
  }
}

export const orderRepository = new OrderRepository(Order);