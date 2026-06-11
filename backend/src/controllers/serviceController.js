import { serviceCatalogService } from "../services/serviceCatalogService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const serviceController = {
  listPublic: catchAsync(async (req, res) => {
    const services = await serviceCatalogService.listPublic(req.query);
    res.json({ success: true, data: services });
  }),

  listAdmin: catchAsync(async (req, res) => {
    const services = await serviceCatalogService.listAdmin(req.query);
    res.json({ success: true, data: services });
  }),

  create: catchAsync(async (req, res) => {
    const service = await serviceCatalogService.create(req.validated.body, req.file);
    res.status(201).json({ success: true, data: service });
  }),

  update: catchAsync(async (req, res) => {
    const service = await serviceCatalogService.update(req.validated.params.id, req.validated.body, req.file);
    res.json({ success: true, data: service });
  }),

  toggle: catchAsync(async (req, res) => {
    const service = await serviceCatalogService.toggle(req.params.id);
    res.json({ success: true, data: service });
  }),

  remove: catchAsync(async (req, res) => {
    await serviceCatalogService.remove(req.params.id);
    res.json({ success: true, message: "Service deleted" });
  }),
};