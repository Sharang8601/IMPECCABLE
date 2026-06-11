import { Service } from "../models/Service.js";
import { BaseRepository } from "./BaseRepository.js";

class ServiceRepository extends BaseRepository {
  findWithRelations(filter = {}) {
    return this.model
      .find(filter)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ sortOrder: 1, createdAt: -1 });
  }
}

export const serviceRepository = new ServiceRepository(Service);