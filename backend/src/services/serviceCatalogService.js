import { categoryRepository } from "../repositories/categoryRepository.js";
import { serviceRepository } from "../repositories/serviceRepository.js";
import { subCategoryRepository } from "../repositories/subCategoryRepository.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";
import { uploadService } from "./uploadService.js";

class ServiceCatalogService {
  async buildFilter(query = {}, includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };

    if (query.category) {
      const category = await categoryRepository.findOne({ slug: query.category.toLowerCase() });
      if (!category) return { _id: { $exists: false } };
      filter.category = category._id;
    }

    if (query.subCategory) {
      const subCategory = await subCategoryRepository.findOne({ slug: query.subCategory.toLowerCase() });
      if (!subCategory) return { _id: { $exists: false } };
      filter.subCategory = subCategory._id;
    }

    if (typeof query.active === "boolean") {
      filter.isActive = query.active;
    }

    return filter;
  }

  async listPublic(query) {
    const filter = await this.buildFilter(query, false);
    return serviceRepository.findWithRelations(filter);
  }

  async listAdmin(query) {
    const filter = await this.buildFilter(query, true);
    return serviceRepository.findWithRelations(filter);
  }

  async create(payload, file) {
    await this.ensureRelations(payload.category, payload.subCategory);

    const image = file
      ? await uploadService.uploadImage(file.buffer)
      : { url: payload.imageUrl || "", publicId: "" };

    return serviceRepository.create({
      title: payload.title,
      slug: slugify(payload.title),
      description: payload.description,
      price: payload.price,
      duration: payload.duration,
      category: payload.category,
      subCategory: payload.subCategory,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
      image,
    });
  }

  async update(id, payload, file) {
    if (payload.category || payload.subCategory) {
      const existing = await serviceRepository.findById(id);
      if (!existing) throw new AppError("Service not found", 404);
      await this.ensureRelations(payload.category || existing.category, payload.subCategory || existing.subCategory);
    }

    const update = { ...payload };
    delete update.imageUrl;

    if (payload.title) update.slug = slugify(payload.title);
    if (file) update.image = await uploadService.uploadImage(file.buffer);
    if (!file && payload.imageUrl !== undefined) update.image = { url: payload.imageUrl, publicId: "" };

    const service = await serviceRepository.updateById(id, update);
    if (!service) throw new AppError("Service not found", 404);
    return service.populate(["category", "subCategory"]);
  }

  async toggle(id) {
    const service = await serviceRepository.findById(id);
    if (!service) throw new AppError("Service not found", 404);

    service.isActive = !service.isActive;
    return service.save();
  }

  async remove(id) {
    const service = await serviceRepository.deleteById(id);
    if (!service) throw new AppError("Service not found", 404);
    return service;
  }

  async ensureRelations(categoryId, subCategoryId) {
    const [category, subCategory] = await Promise.all([
      categoryRepository.findById(categoryId),
      subCategoryRepository.findById(subCategoryId),
    ]);

    if (!category) throw new AppError("Category not found", 404);
    if (!subCategory) throw new AppError("Sub category not found", 404);

    if (subCategory.category.toString() !== category._id.toString()) {
      throw new AppError("Sub category does not belong to selected category", 422);
    }
  }
}

export const serviceCatalogService = new ServiceCatalogService();