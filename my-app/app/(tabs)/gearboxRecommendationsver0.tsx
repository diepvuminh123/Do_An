import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, FlatList, Image } from 'react-native';

const dummyGearboxes = [
  { id: '1', name: 'SEW R47', gearRatio: '12:1', torque: '440 Nm', efficiency: '95%', price: '15,000,000 VND' },
  { id: '2', name: 'SEW R47', gearRatio: '12:1', torque: '450 Nm', efficiency: '96%', price: '15,000,000 VND' },
  { id: '3', name: 'SEW R47', gearRatio: '12:1', torque: '460 Nm', efficiency: '95%', price: '15,000,000 VND' },
  { id: '4', name: 'SEW R47', gearRatio: '12:1', torque: '430 Nm', efficiency: '94%', price: '15,000,000 VND' },
];

export default function GearboxRecommendationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryBox}>
        <Text style={styles.sectionTitle}>Technical Specifications</Text>
        <Text style={styles.item}>Motor Power: <Text style={styles.bold}>5.5 kW</Text></Text>
        <Text style={styles.item}>Input Speed: <Text style={styles.bold}>1450 RPM</Text></Text>
        <Text style={styles.item}>Output Speed: <Text style={styles.bold}>120 RPM</Text></Text>
        <Text style={styles.item}>Torque: <Text style={styles.bold}>440 Nm</Text></Text>
        <Text style={styles.item}>Gear Ratio: <Text style={styles.bold}>12.08</Text></Text>

        <Text style={styles.sectionTitle}>Installation Type</Text>
        <Text style={styles.item}>Load: <Text style={styles.bold}>Medium Load</Text></Text>
        <Text style={styles.item}>Operating Time: <Text style={styles.bold}>8-16 hours</Text></Text>
        <Text style={styles.item}>Environment: <Text style={styles.bold}>Normal</Text></Text>

        <Text style={styles.sectionTitle}>Working Conditions</Text>
        <Text style={styles.item}>Gearbox: <Text style={styles.bold}>Worm Gear</Text></Text>
        <Text style={styles.item}>Mounting: <Text style={styles.bold}>Horizontal</Text></Text>
        <Text style={styles.item}>Connection: <Text style={styles.bold}>Direct Shaft</Text></Text>
      </View>

      <TextInput style={styles.searchInput} placeholder="Tìm kiếm mã sản phẩm..." />

      {/* Danh sách sản phẩm */}
      <FlatList
        data={dummyGearboxes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={require('@/assets/images/Gearbox.png')} // hoặc thay bằng ảnh online
              style={{ width: '100%', height: 100, borderRadius: 6, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text>Gear Ratio: {item.gearRatio}</Text>
            <Text>Torque: {item.torque}</Text>
            <Text>Efficiency: {item.efficiency}</Text>
            <Text style={styles.cardPrice}>Price: {item.price}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#001627',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '48%',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  cardPrice: {
    color: '#007bff',
    marginTop: 4,
    fontWeight: '600',
  },
});
