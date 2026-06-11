import { Cart } from "../models/Cart.js";
import { BaseRepository } from "./BaseRepository.js";

class CartRepository extends BaseRepository {
  findByUser(userId) {
    return this.model.findOne({ user: userId }).populate({
      path: "items.service",
      select: "title price duration image isActive",
    });
  }
}

export const cartRepository = new CartRepository(Cart);