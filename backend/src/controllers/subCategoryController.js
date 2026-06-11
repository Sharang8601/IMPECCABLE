import { subCategoryService } from "../services/subCategoryService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const subCategoryController = {
  listPublic: catchAsync(async (req, res) => {
    const subCategories = await subCategoryService.listPublic(req.query);
    res.json({ success: true, data: subCategories });
  }),

  listAdmin: catchAsync(async (_req, res) => {
    const subCategories = await subCategoryService.listAdmin();
    res.json({ success: true, data: subCategories });
  }),

  create: catchAsync(async (req, res) => {
    const subCategory = await subCategoryService.create(req.validated.body);
    res.status(201).json({ success: true, data: subCategory });
  }),

  update: catchAsync(async (req, res) => {
    const subCategory = await subCategoryService.update(req.validated.params.id, req.validated.body);
    res.json({ success: true, data: subCategory });
  }),

  remove: catchAsync(async (req, res) => {
    await subCategoryService.remove(req.validated.params.id);
    res.json({ success: true, message: "Sub category deleted" });
  }),
};