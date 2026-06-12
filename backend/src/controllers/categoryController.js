import { categoryService } from "../services/categoryService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const categoryController = {
  listPublic: catchAsync(async (req, res) => {
    const categories = await categoryService.listPublic(req.query);
    res.json({ success: true, data: categories });
  }),

  listAdmin: catchAsync(async (req, res) => {
    const categories = await categoryService.listAdmin(req.query);
    res.json({ success: true, data: categories });
  }),

  create: catchAsync(async (req, res) => {
    const category = await categoryService.create(req.validated.body, req.file);
    res.status(201).json({ success: true, data: category });
  }),

  update: catchAsync(async (req, res) => {
    const category = await categoryService.update(req.validated.params.id, req.validated.body, req.file);
    res.json({ success: true, data: category });
  }),

  remove: catchAsync(async (req, res) => {
    await categoryService.remove(req.validated.params.id);
    res.json({ success: true, message: "Category deleted" });
  }),
};