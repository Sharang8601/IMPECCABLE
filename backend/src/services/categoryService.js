import { categoryRepository } from "../repositories/categoryRepository.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";
import { uploadService } from "./uploadService.js";

class CategoryService {
  listPublic(query = {}) {
    const filter = { isActive: true };
    if (query.gender) {
      filter.gender = query.gender;
    }
    return categoryRepository.find(filter).sort({ displayOrder: 1, name: 1 });
  }

  listAdmin(query = {}) {
    const filter = {};
    if (query.gender) {
      filter.gender = query.gender;
    }
    return categoryRepository.find(filter).sort({ displayOrder: 1, name: 1 });
  }

  async create(payload, file) {
    const image = file
      ? await uploadService.uploadImage(file.buffer)
      : { url: payload.imageUrl || "", publicId: "" };

    return categoryRepository.create({
      name: payload.name,
      slug: slugify(payload.name),
      gender: payload.gender,
      displayOrder: payload.displayOrder ?? 0,
      isActive: payload.isActive ?? true,
      image,
    });
  }

  async update(id, payload, file) {
    const update = { ...payload };
    delete update.imageUrl;

    if (payload.name) update.slug = slugify(payload.name);
    if (file) update.image = await uploadService.uploadImage(file.buffer);
    if (!file && payload.imageUrl !== undefined) {
      update.image = { url: payload.imageUrl, publicId: "" };
    }

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