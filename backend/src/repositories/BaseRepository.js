export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(payload) {
    return this.model.create(payload);
  }

  findById(id, projection = null) {
    return this.model.findById(id, projection);
  }

  findOne(filter, projection = null) {
    return this.model.findOne(filter, projection);
  }

  find(filter = {}, projection = null, options = {}) {
    return this.model.find(filter, projection, options);
  }

  updateById(id, payload, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, payload, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}