import { cartRepository } from "../repositories/cartRepository.js";
import { serviceRepository } from "../repositories/serviceRepository.js";
import { AppError } from "../utils/AppError.js";

class CartService {
  async get(userId) {
    return cartRepository.findByUser(userId) || cartRepository.create({ user: userId, items: [] });
  }

  async replace(userId, items) {
    await this.ensureServices(items.map((item) => item.serviceId));

    return cartRepository.model
      .findOneAndUpdate(
        { user: userId },
        { user: userId, items: items.map((item) => ({ service: item.serviceId, quantity: item.quantity })) },
        { new: true, upsert: true, runValidators: true },
      )
      .populate({ path: "items.service", select: "title price duration image isActive" });
  }

  async add(userId, item) {
    await this.ensureServices([item.serviceId]);

    const cart = await cartRepository.model.findOne({ user: userId });
    if (!cart) {
      return this.replace(userId, [item]);
    }

    const existing = cart.items.find((cartItem) => cartItem.service.toString() === item.serviceId);
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + item.quantity);
    } else {
      cart.items.push({ service: item.serviceId, quantity: item.quantity });
    }

    await cart.save();
    return cartRepository.findByUser(userId);
  }

  async remove(userId, serviceId) {
    const cart = await cartRepository.model.findOne({ user: userId });
    if (!cart) return this.get(userId);

    cart.items = cart.items.filter((item) => item.service.toString() !== serviceId);
    await cart.save();
    return cartRepository.findByUser(userId);
  }

  clear(userId) {
    return cartRepository.model.findOneAndUpdate({ user: userId }, { items: [] }, { new: true, upsert: true });
  }

  async ensureServices(serviceIds) {
    const uniqueIds = [...new Set(serviceIds)];
    const services = await serviceRepository.find({ _id: { $in: uniqueIds }, isActive: true });

    if (services.length !== uniqueIds.length) {
      throw new AppError("One or more services are unavailable", 422);
    }
  }
}

export const cartService = new CartService();