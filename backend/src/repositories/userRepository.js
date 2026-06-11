import { User } from "../models/User.js";
import { BaseRepository } from "./BaseRepository.js";

class UserRepository extends BaseRepository {}

export const userRepository = new UserRepository(User);