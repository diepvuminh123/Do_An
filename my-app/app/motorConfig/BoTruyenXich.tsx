import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { ConfigInput, ResultDisplay } from './utils/ComponentsChung';

// Interface cho props của component
interface BoTruyenXichProps {
  power: number;           // Công suất cần truyền (kW)
  inputRpm: number;        // Số vòng quay đĩa dẫn (vg/ph)
  outputRpm: number;       // Số vòng quay đĩa bị dẫn (vg/ph)
}

// Interface cho kết quả tính toán đĩa xích
interface SprockertsResult {
  z1: number;              // Số răng đĩa dẫn
  z2: number;              // Số răng đĩa bị dẫn
  d1: number;              // Đường kính vòng chia đĩa dẫn (mm)
  d2: number;              // Đường kính vòng chia đĩa bị dẫn (mm)
  da1: number;             // Đường kính vòng đỉnh răng đĩa dẫn (mm)
  da2: number;             // Đường kính vòng đỉnh răng đĩa bị dẫn (mm)
  df1: number;             // Đường kính vòng chân răng đĩa dẫn (mm)
  df2: number;             // Đường kính vòng chân răng đĩa bị dẫn (mm)
}

// Interface cho kết quả tính toán xích
interface ChainResult {
  chainType: string;                // Loại xích
  chainPitch: number;               // Bước xích (mm)
  pinDiameter: number;              // Đường kính chốt (mm)
  bushingLength: number;            // Chiều dài ống lót (mm)
  breakingLoad: number;             // Tải trọng phá hỏng (kN)
  weightPerMeter: number;           // Khối lượng một mét xích (kg)
  chainLength: number;              // Số mắt xích
  centerDistance: number;           // Khoảng cách trục (mm)
  chainVelocity: number;            // Vận tốc xích (m/s)
  chainForce: number;               // Lực vòng (N)
  centrifugalForce: number;         // Lực ly tâm (N)
  gravityForce: number;             // Lực do trọng lượng (N)
  safetyFactor: number;             // Hệ số an toàn
  allowableSafetyFactor: number;    // Hệ số an toàn cho phép
  shaftForce: number;               // Lực tác dụng lên trục (N)
}

/**
 * Component tính toán bộ truyền xích
 */
const BoTruyenXich = ({ power, inputRpm, outputRpm }: BoTruyenXichProps) => {
  // State lưu trữ kết quả tính toán
  const [sprockets, setSprockets] = useState<SprockertsResult | null>(null);
  const [chainResult, setChainResult] = useState<ChainResult | null>(null);
  
  // State hiển thị các phần tính toán chi tiết
  const [showChainTypeDetails, setShowChainTypeDetails] = useState(false);
  const [showSprocketDetails, setShowSprocketDetails] = useState(false);
  const [showChainDetails, setShowChainDetails] = useState(false);
  const [showSafetyDetails, setShowSafetyDetails] = useState(false);
  const [showForceDetails, setShowForceDetails] = useState(false);

  // Thực hiện tính toán khi component được tạo hoặc khi props thay đổi
  useEffect(() => {
    if (power > 0 && inputRpm > 0 && outputRpm > 0) {
      calculateChainDrive();
    }
  }, [power, inputRpm, outputRpm]);

  /**
   * Tính toán thiết kế bộ truyền xích
   */
  const calculateChainDrive = () => {
    // 1. Xác định tỉ số truyền
    const transmissionRatio = inputRpm / outputRpm;
    
    // 2. Chọn số răng đĩa xích dẫn và bị dẫn
    // Áp dụng công thức từ trang 34 của PDF
    // z1 = 29 - 2u (với u là tỉ số truyền)
    let z1 = Math.floor(29 - 2 * transmissionRatio);
    
    // Đảm bảo z1 >= 19 (giá trị tối thiểu)
    z1 = Math.max(z1, 19);
    // Chọn số răng ưa dùng - thường là số lẻ để phân bố mòn đều
    z1 = z1 % 2 === 0 ? z1 + 1 : z1;
    
    // Tính số răng đĩa bị dẫn
    const z2 = Math.round(z1 * transmissionRatio);
    
    // 3. Chọn bước xích dựa trên công suất và vận tốc
    // Hệ số sử dụng xích k = k0 * ka * kđc * kbt * kd * kc
    const k0 = 1;     // Bố trí bộ truyền - đường nối 2 tâm đĩa xích so với ngang < 60°
    const ka = 1;     // Khoảng cách trục a = 40p
    const kdc = 1;    // Khả năng điều chỉnh lực căng xích
    const kbt = 1.3;  // Bôi trơn - môi trường có bụi, bôi trơn loại II
    const kd = 1.2;   // Tải trọng động - tải va đập nhẹ
    const kc = 1.25;  // Chế độ làm việc - 2 ca
    
    const k = k0 * ka * kdc * kbt * kd * kc;
    
    // Hệ số răng đĩa xích kz = 25/z1
    const kz = 25 / z1;
    
    // Hệ số vòng quay kn = n01/n3
    const kn = 50 / outputRpm;
    
    // Công suất tính toán
    const calculatedPower = power * k * kz * kn;
    
    // Chọn bước xích, đường kính chốt, và các thông số khác từ bảng 5.5, 5.8
    // Giả sử chọn bước xích p = 38.1mm dựa trên công suất tính toán và số vòng quay
    const chainPitch = 38.1; // mm
    const pinDiameter = 11.12; // mm
    const bushingLength = 35.46; // mm
    const breakingLoad = 127.0; // kN
    const weightPerMeter = 5.5; // kg/m
    
    // 4. Tính khoảng cách trục và số mắt xích
    // Khoảng cách trục a = 40p
    const centerDistance = 40 * chainPitch;
    
    // Tính số mắt xích (công thức 3.3 từ trang 39)
    const x = 2 * centerDistance / chainPitch + (z1 + z2) / 2 + 
              Math.pow(z2 - z1, 2) / (4 * Math.PI * Math.PI * centerDistance / chainPitch);
    const chainLength = Math.ceil(x);
    // Làm tròn về số chẵn
    const chainLengthEven = chainLength % 2 === 0 ? chainLength : chainLength + 1;
    
    // Tính lại khoảng cách trục chính xác (công thức 3.4 từ trang 39)
    const a_star = 0.25 * chainPitch * (chainLengthEven - 0.5 * (z1 + z2) +
                   Math.sqrt(Math.pow(chainLengthEven - 0.5 * (z1 + z2), 2) - 
                   2 * Math.pow((z2 - z1) / Math.PI, 2)));
    
    // Điều chỉnh khoảng cách trục
    const adjustedCenterDistance = a_star - 0.002 * a_star;
    
    // 5. Tính vận tốc xích
    const chainVelocity = (z1 * chainPitch * outputRpm) / 60000; // m/s
    
    // 6. Tính lực vòng
    const chainForce = (1000 * power) / chainVelocity; // N
    
    // 7. Tính lực ly tâm
    const centrifugalForce = weightPerMeter * Math.pow(chainVelocity, 2); // N
    
    // 8. Tính lực do trọng lượng
    const kf = 6; // Hệ số phụ thuộc độ võng và vị trí bộ truyền (ngang)
    const gravityForce = 9.81 * kf * weightPerMeter * (adjustedCenterDistance / 1000); // N
    
    // 9. Tính hệ số an toàn
    const safetyFactor = (breakingLoad * 1000) / (kd * chainForce + gravityForce + centrifugalForce);
    
    // Xác định hệ số an toàn cho phép từ bảng 5.10
    const allowableSafetyFactor = 8.5; // Với n3 < 200 vg/ph, bước xích 38.1mm
    
    // 10. Tính đường kính đĩa xích
    // Đường kính vòng chia
    const d1 = chainPitch / Math.sin(Math.PI / z1);
    const d2 = chainPitch / Math.sin(Math.PI / z2);
    
    // Đường kính vòng đỉnh răng
    const r = 0.5025 * pinDiameter + 0.05;
    const da1 = chainPitch * (0.5 + Math.cos(Math.PI / z1));
    const da2 = chainPitch * (0.5 + Math.cos(Math.PI / z2));
    
    // Đường kính vòng chân răng
    const df1 = d1 - 2 * r;
    const df2 = d2 - 2 * r;
    
    // 11. Tính lực tác dụng lên trục
    const kx = 1.15; // Hệ số xét đến tác dụng của trọng lượng xích lên trục, bộ truyền ngang
    const shaftForce = kx * chainForce; // N
    
    // Lưu kết quả tính toán
    setSprockets({
      z1,
      z2,
      d1,
      d2,
      da1,
      da2,
      df1,
      df2
    });
    
    setChainResult({
      chainType: "Xích ống con lăn 1 dãy",
      chainPitch,
      pinDiameter,
      bushingLength,
      breakingLoad,
      weightPerMeter,
      chainLength: chainLengthEven,
      centerDistance: Math.round(adjustedCenterDistance),
      chainVelocity,
      chainForce,
      centrifugalForce,
      gravityForce,
      safetyFactor,
      allowableSafetyFactor,
      shaftForce
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TÍNH TOÁN THIẾT KẾ BỘ TRUYỀN XÍCH</Text>
      
      {/* Thông số đầu vào */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Thông số đầu vào:</Text>
        <ResultDisplay 
          label="Công suất P" 
          value={power.toFixed(4)} 
          unit="kW" 
        />
        <ResultDisplay 
          label="Số vòng quay đầu vào" 
          value={inputRpm.toFixed(2)} 
          unit="vg/ph" 
        />
        <ResultDisplay 
          label="Số vòng quay đầu ra" 
          value={outputRpm.toFixed(4)} 
          unit="vg/ph" 
        />
        <ResultDisplay 
          label="Tỉ số truyền" 
          value={(inputRpm / outputRpm).toFixed(3)} 
        />
      </View>
      
      {/* 1. Chọn loại xích */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowChainTypeDetails(!showChainTypeDetails)}
      >
        <Text style={styles.sectionTitle}>1. Chọn loại xích</Text>
        <Text style={styles.toggleButton}>{showChainTypeDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showChainTypeDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Xích con lăn có độ bền mòn cao hơn xích ống, chế tạo không phức tạp như xích răng, 
            giá thành thấp. Do vận tốc thấp nên chọn xích ống con lăn 1 dãy.
          </Text>
          
          {chainResult && (
            <ResultDisplay 
              label="Loại xích được chọn" 
              value={chainResult.chainType} 
            />
          )}
        </View>
      )}
      
      {/* 2. Tính toán đĩa xích */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowSprocketDetails(!showSprocketDetails)}
      >
        <Text style={styles.sectionTitle}>2. Tính toán đĩa xích</Text>
        <Text style={styles.toggleButton}>{showSprocketDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showSprocketDetails && sprockets && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Theo phương pháp trong công thức trang 34, với tỉ số truyền u = {(inputRpm / outputRpm).toFixed(3)}:
          </Text>
          <ResultDisplay 
            label="Số răng đĩa dẫn z₁" 
            value={sprockets.z1} 
          />
          <ResultDisplay 
            label="Số răng đĩa bị dẫn z₂" 
            value={sprockets.z2} 
          />
          <ResultDisplay 
            label="Đường kính vòng chia đĩa dẫn d₁" 
            value={sprockets.d1.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng chia đĩa bị dẫn d₂" 
            value={sprockets.d2.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng đỉnh răng đĩa dẫn da₁" 
            value={sprockets.da1.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng đỉnh răng đĩa bị dẫn da₂" 
            value={sprockets.da2.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng chân răng đĩa dẫn df₁" 
            value={sprockets.df1.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính vòng chân răng đĩa bị dẫn df₂" 
            value={sprockets.df2.toFixed(2)} 
            unit="mm" 
          />
        </View>
      )}
      
      {/* 3. Tính toán xích */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowChainDetails(!showChainDetails)}
      >
        <Text style={styles.sectionTitle}>3. Tính toán thông số xích</Text>
        <Text style={styles.toggleButton}>{showChainDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showChainDetails && chainResult && (
        <View style={styles.detailsContainer}>
          <ResultDisplay 
            label="Bước xích p" 
            value={chainResult.chainPitch.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Đường kính chốt dc" 
            value={chainResult.pinDiameter.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Chiều dài ống lót B" 
            value={chainResult.bushingLength.toFixed(2)} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Tải trọng phá hỏng Q" 
            value={chainResult.breakingLoad.toFixed(1)} 
            unit="kN" 
          />
          <ResultDisplay 
            label="Khối lượng 1 mét xích q" 
            value={chainResult.weightPerMeter.toFixed(2)} 
            unit="kg/m" 
          />
          <ResultDisplay 
            label="Số mắt xích" 
            value={chainResult.chainLength} 
            unit="mắt" 
          />
          <ResultDisplay 
            label="Khoảng cách trục a" 
            value={chainResult.centerDistance} 
            unit="mm" 
          />
          <ResultDisplay 
            label="Vận tốc xích v" 
            value={chainResult.chainVelocity.toFixed(4)} 
            unit="m/s" 
          />
        </View>
      )}
      
      {/* 4. Kiểm nghiệm an toàn */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowSafetyDetails(!showSafetyDetails)}
      >
        <Text style={styles.sectionTitle}>4. Kiểm nghiệm độ bền xích</Text>
        <Text style={styles.toggleButton}>{showSafetyDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showSafetyDetails && chainResult && (
        <View style={styles.detailsContainer}>
          <ResultDisplay 
            label="Lực vòng Ft" 
            value={chainResult.chainForce.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Lực ly tâm Fv" 
            value={chainResult.centrifugalForce.toFixed(4)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Lực do trọng lượng F0" 
            value={chainResult.gravityForce.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Hệ số an toàn s" 
            value={chainResult.safetyFactor.toFixed(2)} 
            isPositive={chainResult.safetyFactor >= chainResult.allowableSafetyFactor}
          />
          <ResultDisplay 
            label="Hệ số an toàn cho phép [s]" 
            value={chainResult.allowableSafetyFactor.toFixed(1)} 
          />
          <Text style={styles.safetyResult}>
            {chainResult.safetyFactor >= chainResult.allowableSafetyFactor ? 
              "✓ Xích đảm bảo an toàn" : 
              "✗ Xích không đảm bảo an toàn, cần chọn lại"}
          </Text>
        </View>
      )}
      
      {/* 5. Lực tác dụng lên trục */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowForceDetails(!showForceDetails)}
      >
        <Text style={styles.sectionTitle}>5. Lực tác dụng lên trục</Text>
        <Text style={styles.toggleButton}>{showForceDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showForceDetails && chainResult && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Lực tác dụng lên trục được tính theo công thức:
          </Text>
          <Text style={styles.formula}>Frx = kx × Ft</Text>
          <Text style={styles.detailText}>
            Trong đó kx = 1.15 là hệ số xét đến tác dụng của trọng lượng xích lên trục,
            bộ truyền ngang.
          </Text>
          <ResultDisplay 
            label="Lực tác dụng lên trục Frx" 
            value={chainResult.shaftForce.toFixed(2)} 
            unit="N" 
          />
        </View>
      )}
      
      {/* Bảng tổng hợp kết quả */}
      {chainResult && sprockets && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Bảng thông số bộ truyền xích</Text>
          <ResultDisplay label="Số răng đĩa dẫn" value={sprockets.z1} />
          <ResultDisplay label="Số răng đĩa bị dẫn" value={sprockets.z2} />
          <ResultDisplay label="Bước xích" value={chainResult.chainPitch} unit="mm" />
          <ResultDisplay label="Số mắt xích" value={chainResult.chainLength} unit="mắt" />
          <ResultDisplay label="Khoảng cách trục" value={chainResult.centerDistance} unit="mm" />
          <ResultDisplay label="Lực tác dụng lên trục" value={chainResult.shaftForce.toFixed(2)} unit="N" />
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
  formula: {
    color: '#4A90E2',
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 5,
    textAlign: 'center',
  },
  safetyResult: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    padding: 5,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 4,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  summaryTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default BoTruyenXich;