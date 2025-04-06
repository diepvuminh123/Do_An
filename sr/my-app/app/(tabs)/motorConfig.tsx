import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';

// Interfaces for props
interface ConfigInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}

interface ResultItemProps {
  label: string;
  value: string;
}

// Reusable Input Component
const ConfigInput: React.FC<ConfigInputProps> = ({ label, value, onValueChange }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Enter value"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={value}
        onChangeText={onValueChange}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onValueChange(String(Number(value || 0) + 1))}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onValueChange(String(Math.max(0, Number(value || 0) - 1)))}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Reusable Result Component
const ResultItem: React.FC<ResultItemProps> = ({ label, value }) => (
  <View style={styles.resultItem}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue}>{value}</Text>
  </View>
);

// Main Component
export default function TabMotorConfigurationScreen() {
  const [motorPower, setMotorPower] = useState('');
  const [inputSpeed, setInputSpeed] = useState('');
  const [outputSpeed, setOutputSpeed] = useState('');

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Motor Configuration</Text>

      {/* Technical Specifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Specifications</Text>
        
        <ConfigInput
          label="Motor Power (kW)"
          value={motorPower}
          onValueChange={setMotorPower}
        />
        
        <ConfigInput
          label="Input Speed (RPM)"
          value={inputSpeed}
          onValueChange={setInputSpeed}
        />
        
        <ConfigInput
          label="Desired Output Speed (RPM)"
          value={outputSpeed}
          onValueChange={setOutputSpeed}
        />
      </View>

      {/* Calculation Results */}
      <View style={[styles.section, styles.resultBox]}>
        <Text style={styles.sectionTitle}>Calculation Results</Text>
        <ResultItem label="Torque" value="0 kW" />
        <ResultItem label="Gear ratio" value="0:1" />
      </View>

      {/* Recommendation Button */}
      <Pressable 
        style={({ pressed }) => [
          styles.recommendButton,
          { opacity: pressed ? 0.8 : 1 }
        ]}
      >
        <Text style={styles.recommendText}>Get Component Recommendations</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#001627',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#fff',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultLabel: {
    color: '#333',
    fontSize: 16,
  },
  resultValue: {
    color: '#001627',
    fontSize: 18,
    fontWeight: '700',
  },
  recommendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 16,
    marginTop: 20,
  },
  recommendText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';
// import { Link } from 'expo-router';

// export default function TabMotorConfigurationScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab Motor Configuration</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="app/(tabs)/motorConfig.tsx" />
//       <Link href="/two">
//         <Text style={styles.linkText}>Go to Motor Configuration</Text>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
//   linkText: {
//     marginTop: 20,
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// });
