import { Category } from "../models/Category.js";
import { BaseRepository } from "./BaseRepository.js";

class CategoryRepository extends BaseRepository {}

export const categoryRepository = new CategoryRepository(Category);