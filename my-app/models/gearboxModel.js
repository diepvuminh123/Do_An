// models/gearboxModel.js
const mongoose = require('mongoose');

// Định nghĩa schema cho hộp giảm tốc
const gearboxSchema = new mongoose.Schema({
  motorType: {
    type: String,
    required: true
  },
  outputSpeedRpm: {
    type: String,
    required: true
  },
  ratio: {
    type: String,
    required: true
  },
  outputTorqueNm: {
    type: String,
    required: true
  },
  serviceFactor: {
    type: String,
    required: true
  },
  overhungLoad: {
    type: String,
    required: true
  },
  unitDesignation: {
    type: String,
    required: true
  },
  baseUnitWeightKg: {
    type: String,
    required: true
  },
  motorSize: {
    type: String,
    required: true
  }
});

// Tạo các chỉ mục để tăng tốc độ tìm kiếm
gearboxSchema.index({ motorType: 'text', unitDesignation: 'text', ratio: 'text' });

// Tạo virtual field để trả về URL chi tiết
gearboxSchema.virtual('detailUrl').get(function() {
  return `/catalog/${this._id}`;
});

// Đảm bảo virtual fields được bao gồm khi chuyển đổi sang JSON
gearboxSchema.set('toJSON', { virtuals: true });
gearboxSchema.set('toObject', { virtuals: true });

const Gearbox = mongoose.model('Gearbox', gearboxSchema, 'gearBox');

module.exports = Gearbox;