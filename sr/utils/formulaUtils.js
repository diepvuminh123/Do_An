// Tính công suất cần thiết
exports.calculateRequiredPower = (force, velocity, loadMode) => {
  // Công suất làm việc trên trục công tác
  const workingPower = (force * velocity) / 1000;
  
  // Công suất tương đương
  const { T1, t1, T2, t2 } = loadMode;
  const totalTime = t1 + t2;
  const equivalentPower = workingPower * Math.sqrt(
    ((t1 * Math.pow(T1/T1, 2)) + (t2 * Math.pow(T2/T1, 2))) / totalTime
  );
  
  // Giả sử hiệu suất của hệ thống là 0.85
  const systemEfficiency = 0.85;
  
  // Công suất cần thiết
  return equivalentPower / systemEfficiency;
};

// Tính tốc độ quay cần thiết
exports.calculateMotorSpeed = (velocity, diameter) => {
  // Số vòng quay của trục công tác
  const workingSpeed = (60000 * velocity) / (Math.PI * diameter);
  
  // Giả sử tỉ số truyền sơ bộ
  const preliminaryRatio = 46;
  
  // Tốc độ quay cần thiết
  return workingSpeed * preliminaryRatio;
};

// Tính tỉ số truyền
exports.calculateTransmissionRatio = (motorSpeed, velocity, diameter) => {
  const workingSpeed = (60000 * velocity) / (Math.PI * diameter);
  return motorSpeed / workingSpeed;
};

// Chọn động cơ
exports.selectMotor = (requiredPower, motorSpeed) => {
  // Giả lập việc chọn động cơ từ danh sách có sẵn
  // Trong thực tế, bạn sẽ có database của các loại động cơ
  
  // Giả sử chúng ta có động cơ K160S4 phù hợp
  return {
    model: 'K160S4',
    power: Math.ceil(requiredPower * 10) / 10, // Làm tròn lên
    speed: 1450 // Tốc độ tiêu chuẩn (vg/ph)
  };
};

// Tính toán hộp giảm tốc
exports.calculateGearbox = (transmissionRatio, requiredPower) => {
  // Phân phối tỉ số truyền cho hệ thống
  const chainRatio = 2.56; // Tỉ số truyền xích
  const gearboxRatio = transmissionRatio / chainRatio;
  
  // Phân phối tỉ số truyền trong hộp giảm tốc
  const stageRatio1 = Math.sqrt(gearboxRatio); // Giả lập phân phối đều
  const stageRatio2 = gearboxRatio / stageRatio1;
  
  return {
    totalRatio: gearboxRatio,
    stageRatios: [stageRatio1, stageRatio2],
    dimensions: {
      length: 500, // mm
      width: 350,  // mm
      height: 400  // mm
    }
  };
};

// Tính toán bộ truyền xích
exports.calculateChain = (transmissionRatio, requiredPower) => {
  // Tính toán thông số xích dựa trên công suất và tỉ số truyền
  return {
    type: 'Roller chain',
    specifications: {
      pitch: 38.1, // mm
      teethCount: {
        driving: 23,
        driven: 59
      },
      length: 120 * 38.1, // mm (số mắt xích * bước xích)
      axisDistance: 1480, // mm
      forceOnAxis: 6927.76 // N
    }
  };
};

// Tính toán kích thước các trục
exports.calculateShafts = (transmissionRatio, requiredPower) => {
  // Tính các mô-men xoắn trên các trục
  const inputTorque = (9550 * requiredPower) / 1450; // N.mm
  
  // Tính toán đường kính các trục dựa trên mô-men xoắn
  return [
    {
      name: 'Trục I (đầu vào)',
      diameter: 25, // mm
      length: 204   // mm
    },
    {
      name: 'Trục II (trung gian)',
      diameter: 45, // mm
      length: 204   // mm
    },
    {
      name: 'Trục III (đầu ra)',
      diameter: 55, // mm
      length: 292.75 // mm
    }
  ];
};