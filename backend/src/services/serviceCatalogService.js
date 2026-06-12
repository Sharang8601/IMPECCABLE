import { categoryRepository } from "../repositories/categoryRepository.js";
import { serviceRepository } from "../repositories/serviceRepository.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";
import { uploadService } from "./uploadService.js";

class ServiceCatalogService {
  async buildFilter(query = {}, includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };

    const categorySlugOrId = query.categoryId || query.category;
    if (categorySlugOrId) {
      // Check if it's a valid ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(categorySlugOrId);
      if (isValidObjectId) {
        filter.categoryId = categorySlugOrId;
      } else {
        const category = await categoryRepository.findOne({ slug: categorySlugOrId.toLowerCase() });
        if (!category) return { _id: { $exists: false } };
        filter.categoryId = category._id;
      }
    }

    if (query.gender) {
      filter.gender = query.gender;
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
    const targetCategoryId = payload.categoryId || payload.category;
    await this.ensureRelations(targetCategoryId);

    const image = file
      ? await uploadService.uploadImage(file.buffer)
      : { url: payload.imageUrl || "", publicId: "" };

    const name = payload.name || payload.title;

    return serviceRepository.create({
      name,
      title: name,
      slug: slugify(name),
      description: payload.description,
      price: payload.price,
      mrp: payload.mrp || 0,
      duration: payload.duration,
      categoryId: targetCategoryId,
      category: targetCategoryId,
      gender: payload.gender,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
      image,
    });
  }

  async update(id, payload, file) {
    const targetCategoryId = payload.categoryId || payload.category;
    if (targetCategoryId) {
      await this.ensureRelations(targetCategoryId);
    }

    const update = { ...payload };
    delete update.imageUrl;

    const name = payload.name || payload.title;
    if (name) {
      update.name = name;
      update.title = name;
      update.slug = slugify(name);
    }

    if (targetCategoryId) {
      update.categoryId = targetCategoryId;
      update.category = targetCategoryId;
    }

    if (file) update.image = await uploadService.uploadImage(file.buffer);
    if (!file && payload.imageUrl !== undefined) {
      update.image = { url: payload.imageUrl, publicId: "" };
    }

    const service = await serviceRepository.updateById(id, update);
    if (!service) throw new AppError("Service not found", 404);
    return service.populate("categoryId");
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

  async ensureRelations(categoryId) {
    if (!categoryId) throw new AppError("Category is required", 400);
    const category = await categoryRepository.findById(categoryId);
    if (!category) throw new AppError("Category not found", 404);
  }
}

export const serviceCatalogService = new ServiceCatalogService();