import { Service } from "../models/Service.js";
import { BaseRepository } from "./BaseRepository.js";

class ServiceRepository extends BaseRepository {
  findWithRelations(filter = {}) {
    return this.model
      .find(filter)
      .populate("categoryId", "name slug gender")
      .populate("category", "name slug gender")
      .sort({ sortOrder: 1, createdAt: -1 });
  }
}

export const serviceRepository = new ServiceRepository(Service);