import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

// Định nghĩa interface cho thông số tải
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

// Định nghĩa interface cho props của component
interface ThongSoBangTaiProps {
  thongSo: ThongSoTai;
  onThongSoChange: (param: keyof ThongSoTai, value: string) => void;
  onCalculatePress?: () => void; // Callback khi nhấn nút tính toán từ component cha
}

/**
 * Component nhập liệu thông số tải và băng tải
 */
const ThongSoBangTai = ({ thongSo, onThongSoChange, onCalculatePress }: ThongSoBangTaiProps) => {
  // State lưu trữ lỗi và trường thiếu dữ liệu
  const [errors, setErrors] = useState<Record<keyof ThongSoTai, string | null>>({
    forceF: null,
    beltSpeed: null,
    drumDiameter: null,
    lifetimeYears: null,
    loadTimeRatioT1: null,
    loadTimeRatioT2: null,
    loadRatioT1: null,
    loadRatioT2: null
  });
  
  // State lưu trữ trường đang được nhập
  const [missingFields, setMissingFields] = useState<Record<keyof ThongSoTai, boolean>>({
    forceF: false,
    beltSpeed: false,
    drumDiameter: false,
    lifetimeYears: false,
    loadTimeRatioT1: false,
    loadTimeRatioT2: false,
    loadRatioT1: false,
    loadRatioT2: false
  });

  // Refs cho các TextInput
  const inputRefs = useRef<Record<keyof ThongSoTai, TextInput | null>>({
    forceF: null,
    beltSpeed: null,
    drumDiameter: null,
    lifetimeYears: null,
    loadTimeRatioT1: null,
    loadTimeRatioT2: null,
    loadRatioT1: null,
    loadRatioT2: null
  });

  // Định nghĩa các placeholder và giới hạn
  const placeholders = {
    forceF: "Nhập giá trị từ 1 đến vô cùng",
    beltSpeed: "Nhập giá trị từ 0,1 đến 50",
    drumDiameter: "Nhập giá trị từ 300 đến 1500",
    lifetimeYears: "Nhập giá trị từ 0 đến 10",
    loadTimeRatioT1: "Từ 0 đến vô cùng",
    loadTimeRatioT2: "Từ 0 đến vô cùng",
    loadRatioT1: "Từ 0 đến 1",
    loadRatioT2: "Từ 0 đến 1"
  };

  // Validation functions
  const validateForceF = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 1 || !Number.isInteger(number)) {
      return "Tôi là lực kéo, không thích số âm đâu nha! Nhập số nguyên dương từ 1 trở lên đi bạn ơi!";
    }
    return null;
  };

  const validateBeltSpeed = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 0.1 || number > 50) {
      return "Vận tốc mà thấp hơn 0.1 m/s thì tôi buồn ngủ mất! Hãy nhập giá trị từ 0.1 đến 50 m/s nhé!";
    }
    return null;
  };

  const validateDrumDiameter = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 300 || number > 1500 || !Number.isInteger(number)) {
      return "Tôi là tang, nhỏ hơn 300 mm thì tôi thấy mình bị 'dìm hàng' quá! Nhập từ 300 đến 1500 mm giúp tôi với!";
    }
    return null;
  };

  const validateLifetimeYears = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 0 || number > 10 || !Number.isInteger(number)) {
      return "Ôi trời, tôi mới 10 tuổi mà đã muốn nghỉ hưu rồi sao? Nhập giá trị từ 0 đến 10 năm thôi nhé!";
    }
    return null;
  };

  const validateLoadTimeRatio = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 0 || !Number.isInteger(number)) {
      return "Thời gian tải mà âm thì tôi đi ngược thời gian à? Nhập số nguyên dương từ 0 trở lên nhé!";
    }
    return null;
  };

  const validateLoadRatio = (value: string): string | null => {
    if (!value) return null; // Skip validation for empty values
    const number = parseFloat(value);
    if (isNaN(number) || number < 0 || number > 1) {
      return "Tỷ lệ T1/T phải nằm trong khoảng từ 0 đến 1 chứ! Đừng để tôi bị 'quá tải' nha!";
    }
    return null;
  };

  // Kiểm tra trường trống
  const checkMissingField = (value: string): boolean => {
    return value.trim() === '';
  };

  // Handle value changes with validation
  const handleValueChange = (param: keyof ThongSoTai, value: string) => {
    // Update the value through the prop method
    onThongSoChange(param, value);

    // Cập nhật trạng thái thiếu dữ liệu
    setMissingFields(prev => ({
      ...prev,
      [param]: false // Đánh dấu là đã nhập
    }));

    // Validate the new value
    let errorMessage: string | null = null;
    
    switch (param) {
      case 'forceF':
        errorMessage = validateForceF(value);
        break;
      case 'beltSpeed':
        errorMessage = validateBeltSpeed(value);
        break;
      case 'drumDiameter':
        errorMessage = validateDrumDiameter(value);
        break;
      case 'lifetimeYears':
        errorMessage = validateLifetimeYears(value);
        break;
      case 'loadTimeRatioT1':
      case 'loadTimeRatioT2':
        errorMessage = validateLoadTimeRatio(value);
        break;
      case 'loadRatioT1':
      case 'loadRatioT2':
        errorMessage = validateLoadRatio(value);
        break;
    }

    // Cập nhật trạng thái lỗi mà không làm mất focus
    setErrors(prev => ({
      ...prev,
      [param]: errorMessage
    }));
  };

  // Kiểm tra dữ liệu khi nhấn nút tính toán
  const validateAllFields = () => {
    let isValid = true;
    const newMissingFields = { ...missingFields };
    
    // Kiểm tra các trường trống
    (Object.keys(thongSo) as Array<keyof ThongSoTai>).forEach(key => {
      if (checkMissingField(thongSo[key])) {
        newMissingFields[key] = true;
        isValid = false;
      } else {
        newMissingFields[key] = false;
      }
    });
    
    setMissingFields(newMissingFields);
    
    if (!isValid) {
      Alert.alert(
        "Thiếu dữ liệu",
        "Vui lòng điền đầy đủ các trường bắt buộc được đánh dấu màu vàng.",
        [{ text: "OK" }]
      );
    }
    
    return isValid;
  };

  // Override lại onCalculatePress để kiểm tra dữ liệu trước
  const handleCalculatePress = () => {
    if (validateAllFields() && onCalculatePress) {
      onCalculatePress();
    }
  };

  // Render một input thông thường
  const renderInput = (
    param: keyof ThongSoTai,
    label: string,
    unit: string,
    placeholder: string
  ) => {
    return (
      <View style={styles.inputContainer} key={param}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            ref={ref => { inputRefs.current[param] = ref }}
            style={[
              styles.input,
              errors[param] ? styles.inputError : null,
              missingFields[param] ? styles.inputMissing : null,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={thongSo[param]}
            onChangeText={(value) => handleValueChange(param, value)}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>
        {errors[param] && <Text style={styles.errorText}>{errors[param]}</Text>}
      </View>
    );
  };

  return (
    <View>
      {renderInput('forceF', 'Lực kéo băng tải, F', 'N', placeholders.forceF)}
      {renderInput('beltSpeed', 'Vận tốc băng tải, v', 'm/s', placeholders.beltSpeed)}
      {renderInput('drumDiameter', 'Đường kính tang, D', 'mm', placeholders.drumDiameter)}
      {renderInput('lifetimeYears', 'Thời gian phục vụ, L', 'năm', placeholders.lifetimeYears)}
      
      <View style={styles.loadRatioContainer}>
        <Text style={styles.label}>Chế độ tải:</Text>
        <View style={styles.loadRatioRow}>
          {/* t₁ (s) */}
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>t₁ (s)</Text>
            <TextInput
              ref={ref => { inputRefs.current.loadTimeRatioT1 = ref }}
              style={[
                styles.smallInput,
                errors.loadTimeRatioT1 ? styles.smallInputError : null,
                missingFields.loadTimeRatioT1 ? styles.smallInputMissing : null,
              ]}
              placeholder={placeholders.loadTimeRatioT1}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={thongSo.loadTimeRatioT1}
              onChangeText={(value) => handleValueChange('loadTimeRatioT1', value)}
            />
            {errors.loadTimeRatioT1 && <Text style={styles.smallErrorText}>{errors.loadTimeRatioT1}</Text>}
          </View>

          {/* T₁/T */}
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>T₁/T</Text>
            <TextInput
              ref={ref => { inputRefs.current.loadRatioT1 = ref }}
              style={[
                styles.smallInput,
                errors.loadRatioT1 ? styles.smallInputError : null,
                missingFields.loadRatioT1 ? styles.smallInputMissing : null,
              ]}
              placeholder={placeholders.loadRatioT1}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={thongSo.loadRatioT1}
              onChangeText={(value) => handleValueChange('loadRatioT1', value)}
            />
            {errors.loadRatioT1 && <Text style={styles.smallErrorText}>{errors.loadRatioT1}</Text>}
          </View>

          {/* t₂ (s) */}
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>t₂ (s)</Text>
            <TextInput
              ref={ref => { inputRefs.current.loadTimeRatioT2 = ref }}
              style={[
                styles.smallInput,
                errors.loadTimeRatioT2 ? styles.smallInputError : null,
                missingFields.loadTimeRatioT2 ? styles.smallInputMissing : null,
              ]}
              placeholder={placeholders.loadTimeRatioT2}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={thongSo.loadTimeRatioT2}
              onChangeText={(value) => handleValueChange('loadTimeRatioT2', value)}
            />
            {errors.loadTimeRatioT2 && <Text style={styles.smallErrorText}>{errors.loadTimeRatioT2}</Text>}
          </View>

          {/* T₂/T */}
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>T₂/T</Text>
            <TextInput
              ref={ref => { inputRefs.current.loadRatioT2 = ref }}
              style={[
                styles.smallInput,
                errors.loadRatioT2 ? styles.smallInputError : null,
                missingFields.loadRatioT2 ? styles.smallInputMissing : null,
              ]}
              placeholder={placeholders.loadRatioT2}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={thongSo.loadRatioT2}
              onChangeText={(value) => handleValueChange('loadRatioT2', value)}
            />
            {errors.loadRatioT2 && <Text style={styles.smallErrorText}>{errors.loadRatioT2}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#000',
  },
  inputError: {
    backgroundColor: '#ffcccc',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  inputMissing: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  unit: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    width: 36,
  },
  errorText: {
    color: '#ff6666',
    fontSize: 12,
    marginTop: 4,
  },
  loadRatioContainer: {
    marginBottom: 12,
  },
  loadRatioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  loadRatioInput: {
    width: '22%',
    marginBottom: 12,
  },
  smallLabel: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
  },
  smallInputError: {
    backgroundColor: '#ffcccc',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  smallInputMissing: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  smallErrorText: {
    color: '#ff6666',
    fontSize: 10,
    marginTop: 2,
    height: 28,
  },
});

export default ThongSoBangTai;