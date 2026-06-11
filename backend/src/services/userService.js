import { userRepository } from "../repositories/userRepository.js";

class UserService {
  async upsertGoogleUser(profile) {
    const existing = await userRepository.findOne({ email: profile.email });

    if (existing) {
      existing.name = profile.name;
      existing.avatar = profile.avatar;
      existing.googleId = profile.googleId;
      existing.role = profile.role === "admin" ? "admin" : existing.role;
      existing.isActive = true;
      return existing.save();
    }

    return userRepository.create(profile);
  }

  findById(id) {
    return userRepository.findById(id);
  }

  listCustomers() {
    return userRepository.find({ role: "customer" }).sort({ createdAt: -1 });
  }

  countCustomers() {
    return userRepository.count({ role: "customer" });
  }
}

export const userService = new UserService();