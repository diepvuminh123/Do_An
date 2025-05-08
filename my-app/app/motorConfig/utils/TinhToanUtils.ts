/**
 * Các hàm tiện ích tính toán cho động cơ và hộp giảm tốc
 */

// Interface cho thông số tải
export interface ThongSoTai {
    forceF: string;
    beltSpeed: string;
    drumDiameter: string;
    lifetimeYears: string;
    loadTimeRatioT1: string;
    loadTimeRatioT2: string;
    loadRatioT1: string;
    loadRatioT2: string;
  }
  
  // Interface cho kết quả tính toán động cơ
  export interface KetQuaDongCo {
    workingPower: number;        // Công suất làm việc Plv
    equivalentPower: number;     // Công suất tương đương Ptd
    systemEfficiency: number;    // Hiệu suất hệ thống η
    requiredPower: number;       // Công suất cần thiết Pct
    rotationSpeed: number;       // Số vòng quay trục công tác nlv
    torque: number;              // Mô-men xoắn T
    totalRatio: number;          // Tỉ số truyền tổng cộng ut
    motorRpm: number;            // Số vòng quay động cơ
  }
  
  /**
   * Tính toán yêu cầu động cơ dựa trên thông số tải
   * @param thongSo Thông số tải
   * @returns Kết quả tính toán động cơ
   */
  export const tinhToanYeuCauDongCo = (thongSo: ThongSoTai): KetQuaDongCo => {
    // Trích xuất thông số
    const F = parseFloat(thongSo.forceF);        // Lực vòng trên băng tải (N)
    const v = parseFloat(thongSo.beltSpeed);     // Vận tốc băng tải (m/s)
    const D = parseFloat(thongSo.drumDiameter);  // Đường kính tang (mm)
    const t1 = parseFloat(thongSo.loadTimeRatioT1);  // Thời gian t1 (s)
    const t2 = parseFloat(thongSo.loadTimeRatioT2);  // Thời gian t2 (s)
    const T1_ratio = parseFloat(thongSo.loadRatioT1); // Tỉ lệ T1/T
    const T2_ratio = parseFloat(thongSo.loadRatioT2); // Tỉ lệ T2/T
  
    // 1. Tính công suất làm việc trên trục công tác (kW)
    const workingPower = (F * v) / 1000;
  
    // 2. Tính công suất tương đương (kW)
    const equivalentPower = workingPower * Math.sqrt(
      ((t1 * Math.pow(T1_ratio, 2)) + (t2 * Math.pow(T2_ratio, 2))) / (t1 + t2)
    );
  
    // 3. Tính hiệu suất chung của hệ thống
    // Giả định các hiệu suất thành phần
    const efficiency_chain = 0.96;       // Hiệu suất bộ truyền xích
    const efficiency_gear = 0.96;        // Hiệu suất bộ truyền bánh răng
    const efficiency_bearing = 0.992;    // Hiệu suất một cặp ổ lăn
    const efficiency_coupling = 1;       // Hiệu suất khớp nối
  
    // Hiệu suất tổng hợp
    const systemEfficiency = efficiency_chain * Math.pow(efficiency_gear, 2) * 
                            Math.pow(efficiency_bearing, 4) * efficiency_coupling;
  
    // 4. Tính công suất cần thiết (kW)
    const requiredPower = equivalentPower / systemEfficiency;
  
    // 5. Tính số vòng quay của trục công tác (vòng/phút)
    const rotationSpeed = (60000 * v) / (Math.PI * D);
  
    // 6. Tính mô-men xoắn trên trục công tác (N.mm)
    const torque = 9.55 * 1000000 * (workingPower / rotationSpeed);
  
    // 7. Giả định tỉ số truyền cho bộ truyền xích và hộp giảm tốc
    const ratio_chain = 2.56;            // Tỉ số truyền xích
    const ratio_gearbox = 18;            // Tỉ số truyền hộp giảm tốc
    const totalRatio = ratio_chain * ratio_gearbox;
  
    // 8. Tính số vòng quay cần thiết cho động cơ
    const motorRpm = rotationSpeed * totalRatio;
  
    // Trả về kết quả
    return {
      workingPower: parseFloat(workingPower.toFixed(4)),
      equivalentPower: parseFloat(equivalentPower.toFixed(4)),
      systemEfficiency: parseFloat(systemEfficiency.toFixed(5)),
      requiredPower: parseFloat(requiredPower.toFixed(4)),
      rotationSpeed: parseFloat(rotationSpeed.toFixed(4)),
      torque: parseFloat(torque.toFixed(2)),
      totalRatio: parseFloat(totalRatio.toFixed(3)),
      motorRpm: parseFloat(motorRpm.toFixed(2)),
    };
  };
  
  /**
   * Tính phân phối tỉ số truyền tối ưu cho hộp giảm tốc nhiều cấp
   * @param totalRatio Tỉ số truyền tổng
   * @param stages Số cấp truyền
   * @returns Mảng các tỉ số truyền cho từng cấp
   */
  export const tinhPhanPhoiTiSoTruyen = (totalRatio: number, stages: number = 2): number[] => {
    // Đối với phân phối đều, mỗi cấp có cùng tỉ số
    // Tính tỉ số mỗi cấp là căn bậc n của tỉ số tổng
    const stageRatio = Math.pow(totalRatio, 1 / stages);
    
    // Tạo mảng với cùng tỉ số cho mỗi cấp
    return Array(stages).fill(stageRatio);
  };
  
  /**
   * Tính toán tham số cho bộ truyền xích
   * @param params Tham số bộ truyền xích
   * @returns Kết quả tính toán bộ truyền xích
   */
  export interface ThamSoBoTruyenXich {
    power: number;          // Công suất (kW)
    drivingRpm: number;     // Số vòng quay đĩa chủ động (vg/ph)
    smallSprocketTeeth: number;    // Số răng đĩa nhỏ
    largeSprocketTeeth: number;    // Số răng đĩa lớn
    centerDistance: number;        // Khoảng cách trục (mm)
    chainPitch: number;            // Bước xích (mm)
  }
  
  export interface KetQuaBoTruyenXich {
    chainLength: number;        // Chiều dài xích (đốt)
    actualRatio: number;        // Tỉ số truyền thực tế
    chainSpeed: number;         // Vận tốc xích (m/s)
    chainForce: number;         // Lực kéo xích (N)
    recommendedRows: number;    // Số hàng xích đề xuất
  }
  
  export const tinhToanBoTruyenXich = (params: ThamSoBoTruyenXich): KetQuaBoTruyenXich => {
    // Trích xuất tham số
    const power = params.power;         // Công suất (kW)
    const drivingRpm = params.drivingRpm;  // Số vòng quay đĩa chủ động (vg/ph)
    const z1 = params.smallSprocketTeeth;   // Số răng đĩa nhỏ
    const z2 = params.largeSprocketTeeth;   // Số răng đĩa lớn
    const centerDistance = params.centerDistance;  // Khoảng cách trục (mm)
    const chainPitch = params.chainPitch;  // Bước xích (mm)
    
    // Tính tỉ số truyền
    const ratio = z2 / z1;
    
    // Tính vận tốc xích (m/s)
    const chainSpeed = (chainPitch * z1 * drivingRpm) / (60 * 1000); // Đổi mm sang m và phút sang giây
    
    // Tính lực kéo xích (N)
    const chainForce = (power * 1000) / chainSpeed; // Đổi kW sang W
    
    // Tính chiều dài xích (đốt)
    const L = 2 * Math.floor(centerDistance / chainPitch) + 
              (z1 + z2) / 2 + 
              Math.pow(z2 - z1, 2) / (4 * Math.PI * Math.floor(centerDistance / chainPitch));
    
    const chainLength = Math.ceil(L);
    
    // Xác định số hàng xích dựa vào công suất
    let recommendedRows = 1;
    if (power > 7.5) recommendedRows = 2;
    if (power > 15) recommendedRows = 3;
    
    return {
      chainLength,
      actualRatio: ratio,
      chainSpeed,
      chainForce,
      recommendedRows,
    };
  };
  
  /**
   * Lấy tham số động cơ chuẩn theo công suất
   * @param requiredPower Công suất cần thiết (kW)
   * @returns Tham số động cơ
   */
  export interface ThamSoDongCo {
    power: number;      // Công suất (kW)
    rpm: number;        // Số vòng quay (vg/ph)
    efficiency: number; // Hiệu suất
    model: string;      // Mã hiệu
  }
  
  export const layDongCoChuanHoa = (requiredPower: number): ThamSoDongCo => {
    // Các mức công suất chuẩn (kW)
    const standardPowers = [0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45];
    
    // Tìm mức công suất chuẩn gần nhất lớn hơn hoặc bằng công suất cần thiết
    let selectedPower = standardPowers[0];
    for (const power of standardPowers) {
      if (power >= requiredPower) {
        selectedPower = power;
        break;
      }
    }
    
    // Định nghĩa tham số động cơ chuẩn dựa trên công suất đã chọn
    const motorParams: ThamSoDongCo = {
      power: selectedPower,
      rpm: 1450,      // Số vòng quay chuẩn động cơ không đồng bộ 4 cực
      efficiency: 0.85 + (selectedPower > 15 ? 0.05 : 0),  // Hiệu suất tăng theo công suất
      model: `K${Math.floor(selectedPower * 20)}S4`,  // Quy ước đặt tên đơn giản
    };
    
    return motorParams;
  };
  
  /**
   * Tính bước xích chuẩn dựa trên công suất và số vòng quay
   * @param power Công suất (kW)
   * @param rpm Số vòng quay đĩa chủ động (vg/ph)
   * @returns Bước xích khuyến nghị (mm)
   */
  export const tinhBuocXichKhuyenNghi = (power: number, rpm: number): { calculatedPitch: number, standardPitch: number } => {
    // Công thức đơn giản để ước tính bước xích ban đầu
    // p = K * (P / n)^(1/3) với K là hằng số dựa trên kinh nghiệm
    const K = 30; 
    const recommendedPitch = K * Math.pow((power * 1000) / rpm, 1/3);
    
    // Các bước xích chuẩn (mm)
    const standardPitches = [6.35, 9.525, 12.7, 15.875, 19.05, 25.4, 31.75, 38.1];
    
    // Tìm bước xích chuẩn gần nhất lớn hơn hoặc bằng bước xích đã tính
    let selectedPitch = standardPitches[0];
    for (const pitch of standardPitches) {
      if (pitch >= recommendedPitch) {
        selectedPitch = pitch;
        break;
      }
    }
    
    return {
      calculatedPitch: recommendedPitch,
      standardPitch: selectedPitch
    };
  };
  
  /**
   * Tính hệ số vận tốc cho bộ truyền xích
   * @param velocity Vận tốc xích (m/s)
   * @returns Hệ số vận tốc
   */
  export const tinhHeSoVanToc = (velocity: number): number => {
    // Công thức đơn giản dựa trên vận tốc xích
    if (velocity <= 4) return 1.0;
    if (velocity <= 8) return 0.9;
    if (velocity <= 12) return 0.8;
    return 0.7;
  };
  
  /**
   * Tính hệ số số răng cho bộ truyền xích
   * @param teeth Số răng đĩa xích nhỏ
   * @returns Hệ số số răng
   */
  export const tinhHeSoSoRang = (teeth: number): number => {
    // Công thức đơn giản dựa trên số răng đĩa xích nhỏ
    if (teeth <= 13) return 0.8;
    if (teeth <= 17) return 0.9;
    if (teeth <= 25) return 1.0;
    return 1.1;
  };
  
  /**
   * Tính hệ số chế độ làm việc cho bộ truyền xích
   * @param chainType Loại xích
   * @returns Hệ số chế độ làm việc
   */
  export const tinhHeSoCheDo = (chainType: string): number => {
    // Dựa trên loại xích và ứng dụng
    switch (chainType) {
      case 'heavy':
        return 1.5;
      case 'corrosion':
        return 1.2;
      default:
        return 1.0;
    }
  };