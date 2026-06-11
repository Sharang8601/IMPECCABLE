import { categoryRepository } from "../repositories/categoryRepository.js";
import { subCategoryRepository } from "../repositories/subCategoryRepository.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";

class SubCategoryService {
  async listPublic(query = {}) {
    const filter = { isActive: true };

    if (query.category) {
      const category = await categoryRepository.findOne({ slug: query.category.toLowerCase(), isActive: true });
      if (!category) return [];
      filter.category = category._id;
    }

    return subCategoryRepository.findWithCategory(filter);
  }

  listAdmin() {
    return subCategoryRepository.findWithCategory({});
  }

  async create(payload) {
    const category = await categoryRepository.findById(payload.category);
    if (!category) throw new AppError("Parent category not found", 404);

    return subCategoryRepository.create({ ...payload, slug: slugify(payload.name) });
  }

  async update(id, payload) {
    if (payload.category) {
      const category = await categoryRepository.findById(payload.category);
      if (!category) throw new AppError("Parent category not found", 404);
    }

    const update = { ...payload };
    if (payload.name) update.slug = slugify(payload.name);

    const subCategory = await subCategoryRepository.updateById(id, update);
    if (!subCategory) throw new AppError("Sub category not found", 404);
    return subCategory.populate("category", "name slug");
  }

  async remove(id) {
    const subCategory = await subCategoryRepository.deleteById(id);
    if (!subCategory) throw new AppError("Sub category not found", 404);
    return subCategory;
  }
}

export const subCategoryService = new SubCategoryService();