// controllers/calculationController.js
const Calculation = require('../models/Calculation');
const Project = require('../models/Project');
const formulaUtils = require('../utils/formulaUtils');
const validationUtils = require('../utils/validationUtils');

// Thực hiện tính toán mới
exports.calculateConveyor = async (req, res) => {
  try {
    const { 
      projectId, 
      force, 
      velocity, 
      diameter, 
      serviceYears,
      T1, t1, T2, t2
    } = req.body;

    // Xác thực đầu vào
    if (!validationUtils.validateInputs(req.body)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu đầu vào không hợp lệ' });
    }

    // Kiểm tra dự án tồn tại
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
    }

    // Thực hiện tính toán
    const results = await performCalculations({
      force, 
      velocity, 
      diameter, 
      serviceYears,
      loadMode: { T1, t1, T2, t2 },
      workingConditions: {
        rotationDirection: 'one-way',
        impactType: 'light',
        shiftsPerDay: 2,
        daysPerYear: 300,
        hoursPerShift: 8
      }
    });

    // Lưu kết quả tính toán
    const calculation = new Calculation({
      projectId,
      userId: req.user.id,
      inputs: {
        force,
        velocity,
        diameter,
        serviceYears,
        loadMode: { T1, t1, T2, t2 },
        workingConditions: {
          rotationDirection: 'one-way',
          impactType: 'light',
          shiftsPerDay: 2,
          daysPerYear: 300,
          hoursPerShift: 8
        }
      },
      results
    });

    await calculation.save();

    // Cập nhật kết quả mới nhất cho dự án
    project.inputs = calculation.inputs;
    project.calculationResults = results;
    await project.save();

    return res.status(200).json({
      success: true,
      data: {
        calculation,
        message: 'Tính toán thành công'
      }
    });

  } catch (error) {
    console.error('Calculate Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Hàm thực hiện các tính toán
async function performCalculations(inputs) {
  const { force, velocity, diameter, serviceYears, loadMode, workingConditions } = inputs;
  
  // Công suất cần thiết
  const requiredPower = formulaUtils.calculateRequiredPower(force, velocity, loadMode);
  
  // Tốc độ quay cần thiết
  const motorSpeed = formulaUtils.calculateMotorSpeed(velocity, diameter);
  
  // Tỉ số truyền
  const transmissionRatio = formulaUtils.calculateTransmissionRatio(motorSpeed, velocity, diameter);
  
  // Chọn động cơ
  const selectedMotor = formulaUtils.selectMotor(requiredPower, motorSpeed);
  
  // Tính toán các thông số khác
  const gearbox = formulaUtils.calculateGearbox(transmissionRatio, requiredPower);
  const chain = formulaUtils.calculateChain(transmissionRatio, requiredPower);
  const shaftDimensions = formulaUtils.calculateShafts(transmissionRatio, requiredPower);
  
  return {
    requiredPower,
    motorSpeed,
    transmissionRatio,
    selectedMotor,
    gearbox,
    chain,
    shaftDimensions
  };
}

// Lấy lịch sử tính toán
exports.getCalculationHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const calculations = await Calculation.find({ 
      projectId, 
      userId: req.user.id 
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: calculations
    });
  } catch (error) {
    console.error('Get Calculation History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy chi tiết một bản tính toán
exports.getCalculationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const calculation = await Calculation.findOne({
      _id: id,
      userId: req.user.id
    });
    
    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản tính toán'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Get Calculation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};