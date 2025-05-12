// controllers/catalogController.js
const Gearbox = require('../models/gearboxModel');

exports.getAllGearboxes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let filter = {};
    
    // Xử lý tìm kiếm
    if (req.query.search) {
      filter = {
        $or: [
          { motorType: { $regex: req.query.search, $options: 'i' } },
          { unitDesignation: { $regex: req.query.search, $options: 'i' } },
          { ratio: { $regex: req.query.search, $options: 'i' } },
          { outputTorqueNm: { $regex: req.query.search, $options: 'i' } },
          { motorSize: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    
    // Lọc theo công suất động cơ
    if (req.query.motorType) {
      filter.motorType = { $regex: req.query.motorType, $options: 'i' };
    }
    
    // Lọc theo tỉ số truyền
    if (req.query.ratio) {
      filter.ratio = { $regex: req.query.ratio, $options: 'i' };
    }

    // Lấy tổng số lượng bản ghi phù hợp với điều kiện lọc
    const total = await Gearbox.countDocuments(filter);
    
    // Lấy dữ liệu
    const gearboxes = await Gearbox.find(filter)
      .sort({ motorType: 1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      status: 'success',
      results: gearboxes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        gearboxes
      }
    });
  } catch (err) {
    console.error('Error fetching gearboxes:', err);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy dữ liệu hộp giảm tốc. Vui lòng thử lại sau.'
    });
  }
};

exports.getGearboxById = async (req, res) => {
  try {
    const gearbox = await Gearbox.findById(req.params.id);
    
    if (!gearbox) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy hộp giảm tốc với ID này'
      });
    }
    
    // Tìm các hộp giảm tốc liên quan (có cùng motorType hoặc ratio tương tự)
    const relatedGearboxes = await Gearbox.find({
      _id: { $ne: gearbox._id }, // Không bao gồm hộp giảm tốc hiện tại
      $or: [
        { motorType: gearbox.motorType },
        { ratio: gearbox.ratio }
      ]
    }).limit(5);
    
    res.status(200).json({
      status: 'success',
      data: {
        gearbox,
        relatedGearboxes
      }
    });
  } catch (err) {
    console.error('Error fetching gearbox details:', err);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy chi tiết hộp giảm tốc. Vui lòng thử lại sau.'
    });
  }
};  