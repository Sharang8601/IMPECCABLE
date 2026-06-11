import { SubCategory } from "../models/SubCategory.js";
import { BaseRepository } from "./BaseRepository.js";

class SubCategoryRepository extends BaseRepository {
  findWithCategory(filter = {}) {
    return this.model.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  }
}

export const subCategoryRepository = new SubCategoryRepository(SubCategory);