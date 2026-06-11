import { categoryService } from "../services/categoryService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const categoryController = {
  listPublic: catchAsync(async (_req, res) => {
    const categories = await categoryService.listPublic();
    res.json({ success: true, data: categories });
  }),

  listAdmin: catchAsync(async (_req, res) => {
    const categories = await categoryService.listAdmin();
    res.json({ success: true, data: categories });
  }),

  create: catchAsync(async (req, res) => {
    const category = await categoryService.create(req.validated.body);
    res.status(201).json({ success: true, data: category });
  }),

  update: catchAsync(async (req, res) => {
    const category = await categoryService.update(req.validated.params.id, req.validated.body);
    res.json({ success: true, data: category });
  }),

  remove: catchAsync(async (req, res) => {
    await categoryService.remove(req.validated.params.id);
    res.json({ success: true, message: "Category deleted" });
  }),
};