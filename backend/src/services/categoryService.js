import { categoryRepository } from "../repositories/categoryRepository.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";

class CategoryService {
  listPublic() {
    return categoryRepository.find({ isActive: true }).sort({ createdAt: 1 });
  }

  listAdmin() {
    return categoryRepository.find({}).sort({ createdAt: 1 });
  }

  create(payload) {
    return categoryRepository.create({ ...payload, slug: slugify(payload.name) });
  }

  async update(id, payload) {
    const update = { ...payload };
    if (payload.name) update.slug = slugify(payload.name);

    const category = await categoryRepository.updateById(id, update);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  }

  async remove(id) {
    const category = await categoryRepository.deleteById(id);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  }
}

export const categoryService = new CategoryService();