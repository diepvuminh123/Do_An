import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ResultDisplay } from './utils/ComponentsChung';

// Interface for component props
interface ThietKeHopGiamTocProps {
  power: number;         // Công suất cần thiết (kW)
  torque: number;        // Mô-men xoắn (N.mm)
  rotationSpeed: number; // Số vòng quay (vg/ph)
  totalRatio: number;    // Tỉ số truyền tổng
}

/**
 * Component thiết kế bộ truyền trong hộp giảm tốc
 */
const ThietKeHopGiamToc = ({ power, torque, rotationSpeed, totalRatio }: ThietKeHopGiamTocProps) => {
  // State cho các phần hiển thị
  const [showMaterials, setShowMaterials] = useState(false);
  const [showAllowableStresses, setShowAllowableStresses] = useState(false);
  const [showFastGear, setShowFastGear] = useState(false);
  const [showSlowGear, setShowSlowGear] = useState(false);
  const [showLubrication, setShowLubrication] = useState(false);

  // State lưu kết quả tính toán
  const [materials, setMaterials] = useState({
    fastGearMaterial: 'Thép 40X - Tôi cải thiện',
    fastGearHardness: 265,
    slowGearMaterial: 'Thép 40X - Tôi cải thiện',
    slowGearHardness: 250,
    fastGearTensile: 950,
    fastGearYield: 700,
    slowGearTensile: 850,
    slowGearYield: 550,
  });

  const [allowableStresses, setAllowableStresses] = useState({
    contactStressFastGear: 600,
    contactStressSlowGear: 570,
    contactStressAvg: 531.82,
    bendingStressFastGear: 477,
    bendingStressSlowGear: 450, 
    contactStressMax: 1540,
    bendingStressFastGearMax: 560,
    bendingStressSlowGearMax: 440,
  });

  const [fastGear, setFastGear] = useState({
    axisDistance: 160,
    module: 2,
    helixAngle: 17.01,
    gearRatio: 5.65,
    smallGearTeeth: 23,
    largeGearTeeth: 130,
    smallGearDiameter: 48.10,
    largeGearDiameter: 271.90,
    smallGearTipDiameter: 52.10,
    largGearTipDiameter: 275.90,
    smallGearRootDiameter: 43.10,
    largeGearRootDiameter: 266.90,
    gearWidth: 50.4,
    actualContactStress: 449.51,
    actualBendingStressSmall: 97.08,
    actualBendingStressLarge: 89.61,
  });

  const [slowGear, setSlowGear] = useState({
    axisDistance: 200,
    module: 2,
    helixAngle: 11.48,
    gearRatio: 3.17,
    smallGearTeeth: 47,
    largeGearTeeth: 149,
    smallGearDiameter: 95.92,
    largeGearDiameter: 304.08,
    smallGearTipDiameter: 99.92,
    largGearTipDiameter: 308.08,
    smallGearRootDiameter: 90.92,
    largeGearRootDiameter: 299.08,
    gearWidth: 63,
    actualContactStress: 441.61,
    actualBendingStressSmall: 138.80,
    actualBendingStressLarge: 136.90,
  });

  // Tính toán điều kiện bôi trơn
  const lubricationCheck = () => {
    // Chiều cao răng h2 của bánh răng lớn cấp nhanh
    const h2 = (fastGear.largGearTipDiameter - fastGear.largeGearRootDiameter) / 2;
    
    // Kiểm tra điều kiện mức dầu thấp nhất
    const isMinOilLevelOk = h2 < 10 ? false : true;
    
    // Kiểm tra điều kiện mức dầu cao nhất
    const minLevel = fastGear.largGearTipDiameter / 2 - 10;
    const maxLevel = minLevel - 15;
    const maxAllowed = slowGear.largeGearDiameter / 3;
    
    const isMaxOilLevelOk = maxLevel > maxAllowed;
    
    return {
      h2,
      minLevel,
      maxLevel,
      maxAllowed,
      isMinOilLevelOk,
      isMaxOilLevelOk,
      isOverallOk: isMinOilLevelOk && isMaxOilLevelOk
    };
  };

  const lubricationCondition = lubricationCheck();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THIẾT KẾ BỘ TRUYỀN TRONG HỘP GIẢM TỐC</Text>

      {/* Phần dữ liệu đầu vào */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Dữ liệu đầu vào:</Text>
        <ResultDisplay label="Công suất cần thiết" value={power.toFixed(4)} unit="kW" />
        <ResultDisplay label="Mô-men trục công tác" value={torque.toFixed(2)} unit="N.mm" />
        <ResultDisplay label="Số vòng quay trục công tác" value={rotationSpeed.toFixed(4)} unit="vg/ph" />
        <ResultDisplay label="Tỉ số truyền tổng" value={totalRatio.toFixed(3)} />
      </View>

      {/* 1. Chọn vật liệu */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowMaterials(!showMaterials)}>
        <Text style={styles.sectionTitle}>1. Tính toán chọn vật liệu</Text>
        <Text style={styles.toggleButton}>{showMaterials ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showMaterials && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Dựa vào sơ đồ tải trọng và điều kiện làm việc, ta tiến hành chọn vật liệu theo các hàm mục tiêu: 
            Bền đều, kích thước nhỏ nhất, giá thành rẻ nhất, thuận lợi cho việc gia công cơ khí.
          </Text>
          
          <Text style={styles.subSectionTitle}>Cấp nhanh:</Text>
          <ResultDisplay 
            label="Vật liệu bánh nhỏ" 
            value={materials.fastGearMaterial} 
          />
          <ResultDisplay 
            label="Độ cứng HB₁" 
            value={materials.fastGearHardness} 
          />
          <ResultDisplay 
            label="Giới hạn bền σᵦ" 
            value={materials.fastGearTensile} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="Giới hạn chảy σch" 
            value={materials.fastGearYield} 
            unit="MPa" 
          />
          
          <Text style={styles.subSectionTitle}>Cấp chậm:</Text>
          <ResultDisplay 
            label="Vật liệu bánh nhỏ" 
            value={materials.slowGearMaterial} 
          />
          <ResultDisplay 
            label="Độ cứng HB₂" 
            value={materials.slowGearHardness} 
          />
          <ResultDisplay 
            label="Giới hạn bền σᵦ" 
            value={materials.slowGearTensile} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="Giới hạn chảy σch" 
            value={materials.slowGearYield} 
            unit="MPa" 
          />
        </View>
      )}

      {/* 2. Ứng suất cho phép */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowAllowableStresses(!showAllowableStresses)}>
        <Text style={styles.sectionTitle}>2. Xác định ứng suất cho phép</Text>
        <Text style={styles.toggleButton}>{showAllowableStresses ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showAllowableStresses && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>Ứng suất tiếp xúc cho phép:</Text>
          <ResultDisplay 
            label="[σH₁] - Bánh dẫn cấp nhanh" 
            value={allowableStresses.contactStressFastGear} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="[σH₂] - Bánh bị dẫn cấp nhanh" 
            value={allowableStresses.contactStressSlowGear} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="[σH] - Trung bình" 
            value={allowableStresses.contactStressAvg} 
            unit="MPa" 
          />
          
          <Text style={styles.subSectionTitle}>Ứng suất uốn cho phép:</Text>
          <ResultDisplay 
            label="[σF₁] - Bánh dẫn" 
            value={allowableStresses.bendingStressFastGear} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="[σF₂] - Bánh bị dẫn" 
            value={allowableStresses.bendingStressSlowGear} 
            unit="MPa" 
          />
          
          <Text style={styles.subSectionTitle}>Ứng suất khi quá tải:</Text>
          <ResultDisplay 
            label="[σH]max" 
            value={allowableStresses.contactStressMax} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="[σF₁]max" 
            value={allowableStresses.bendingStressFastGearMax} 
            unit="MPa" 
          />
          <ResultDisplay 
            label="[σF₂]max" 
            value={allowableStresses.bendingStressSlowGearMax} 
            unit="MPa" 
          />
        </View>
      )}

      {/* 3. Bộ truyền cấp nhanh */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowFastGear(!showFastGear)}>
        <Text style={styles.sectionTitle}>3. Bộ truyền cấp nhanh - Bánh răng nghiêng</Text>
        <Text style={styles.toggleButton}>{showFastGear ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showFastGear && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>Thông số cơ bản:</Text>
          <ResultDisplay 
            label="Khoảng cách trục aw₁" 
            value={fastGear.axisDistance} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Mô-đun pháp m₁" 
            value={fastGear.module} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Góc nghiêng răng β" 
            value={fastGear.helixAngle.toFixed(4)} 
            unit="°" 
          />
          <ResultDisplay 
            label="Tỉ số truyền thực u₁" 
            value={fastGear.gearRatio.toFixed(4)} 
          />
          
          <Text style={styles.subSectionTitle}>Thông số bánh răng:</Text>
          <ResultDisplay 
            label="Số răng bánh nhỏ z₁" 
            value={fastGear.smallGearTeeth} 
          />
          <ResultDisplay 
            label="Số răng bánh lớn z₂" 
            value={fastGear.largeGearTeeth} 
          />
          <ResultDisplay 
            label="Đường kính vòng chia bánh nhỏ d₁" 
            value={fastGear.smallGearDiameter.toFixed(4)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng chia bánh lớn d₂" 
            value={fastGear.largeGearDiameter.toFixed(4)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Chiều rộng vành răng bw₁" 
            value={fastGear.gearWidth.toFixed(1)} 
            unit="mm" 
          />
          
          <Text style={styles.subSectionTitle}>Kiểm nghiệm độ bền:</Text>
          <ResultDisplay 
            label="Ứng suất tiếp xúc σH" 
            value={fastGear.actualContactStress.toFixed(4)} 
            unit="MPa" 
            isPositive={fastGear.actualContactStress < allowableStresses.contactStressAvg}
          />
          <ResultDisplay 
            label="Ứng suất uốn bánh nhỏ σF₁" 
            value={fastGear.actualBendingStressSmall.toFixed(4)} 
            unit="MPa" 
            isPositive={fastGear.actualBendingStressSmall < allowableStresses.bendingStressFastGear}
          />
          <ResultDisplay 
            label="Ứng suất uốn bánh lớn σF₂" 
            value={fastGear.actualBendingStressLarge.toFixed(4)} 
            unit="MPa" 
            isPositive={fastGear.actualBendingStressLarge < allowableStresses.bendingStressSlowGear}
          />
        </View>
      )}

      {/* 4. Bộ truyền cấp chậm */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowSlowGear(!showSlowGear)}>
        <Text style={styles.sectionTitle}>4. Bộ truyền cấp chậm - Bánh răng nghiêng</Text>
        <Text style={styles.toggleButton}>{showSlowGear ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showSlowGear && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>Thông số cơ bản:</Text>
          <ResultDisplay 
            label="Khoảng cách trục aw₂" 
            value={slowGear.axisDistance} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Mô-đun pháp m₂" 
            value={slowGear.module} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Góc nghiêng răng β" 
            value={slowGear.helixAngle.toFixed(4)} 
            unit="°" 
          />
          <ResultDisplay 
            label="Tỉ số truyền thực u₂" 
            value={slowGear.gearRatio.toFixed(4)} 
          />
          
          <Text style={styles.subSectionTitle}>Thông số bánh răng:</Text>
          <ResultDisplay 
            label="Số răng bánh nhỏ z₁" 
            value={slowGear.smallGearTeeth} 
          />
          <ResultDisplay 
            label="Số răng bánh lớn z₂" 
            value={slowGear.largeGearTeeth} 
          />
          <ResultDisplay 
            label="Đường kính vòng chia bánh nhỏ d₃" 
            value={slowGear.smallGearDiameter.toFixed(4)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng chia bánh lớn d₄" 
            value={slowGear.largeGearDiameter.toFixed(4)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Chiều rộng vành răng bw₂" 
            value={slowGear.gearWidth.toFixed(1)} 
            unit="mm" 
          />
          
          <Text style={styles.subSectionTitle}>Kiểm nghiệm độ bền:</Text>
          <ResultDisplay 
            label="Ứng suất tiếp xúc σH" 
            value={slowGear.actualContactStress.toFixed(4)} 
            unit="MPa" 
            isPositive={slowGear.actualContactStress < allowableStresses.contactStressAvg}
          />
          <ResultDisplay 
            label="Ứng suất uốn bánh nhỏ σF₁" 
            value={slowGear.actualBendingStressSmall.toFixed(4)} 
            unit="MPa" 
            isPositive={slowGear.actualBendingStressSmall < allowableStresses.bendingStressFastGear}
          />
          <ResultDisplay 
            label="Ứng suất uốn bánh lớn σF₂" 
            value={slowGear.actualBendingStressLarge.toFixed(4)} 
            unit="MPa" 
            isPositive={slowGear.actualBendingStressLarge < allowableStresses.bendingStressSlowGear}
          />
        </View>
      )}

      {/* 5. Điều kiện bôi trơn */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowLubrication(!showLubrication)}>
        <Text style={styles.sectionTitle}>5. Điều kiện bôi trơn hộp giảm tốc</Text>
        <Text style={styles.toggleButton}>{showLubrication ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showLubrication && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Các điều kiện bôi trơn cần đảm bảo:
          </Text>
          <Text style={styles.detailText}>
            1. Mức dầu thấp nhất ngập 0,75 ÷ 2 chiều cao răng h₂ của bánh răng lớn cấp nhanh (ít nhất 10mm).
          </Text>
          <Text style={styles.detailText}>
            2. Khoảng cách giữa mức dầu thấp nhất và cao nhất 10÷15mm.
          </Text>
          <Text style={styles.detailText}>
            3. Mức dầu cao nhất không ngập vượt quá 1/3 bán kính bánh lớn phần cấp chậm.
          </Text>
          
          <Text style={styles.subSectionTitle}>Kết quả kiểm tra:</Text>
          <ResultDisplay 
            label="Chiều cao răng h₂" 
            value={lubricationCondition.h2.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Mức dầu thấp nhất" 
            value={lubricationCondition.minLevel.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Mức dầu cao nhất" 
            value={lubricationCondition.maxLevel.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Giới hạn mức dầu cho phép (1/3 R)" 
            value={lubricationCondition.maxAllowed.toFixed(2)} 
            unit="mm" 
          />
          
          <View style={[
            styles.resultBox, 
            lubricationCondition.isOverallOk ? styles.resultSuccess : styles.resultFailure
          ]}>
            <Text style={styles.resultText}>
              {lubricationCondition.isOverallOk 
                ? "Bộ truyền thỏa mãn điều kiện bôi trơn" 
                : "Bộ truyền không thỏa mãn điều kiện bôi trơn"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    color: '#4A90E2',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: 'rgba(44, 62, 80, 0.4)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  resultBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  resultSuccess: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  resultFailure: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ThietKeHopGiamToc;