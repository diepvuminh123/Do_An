import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Dữ liệu và types
type SpecificationItem = {
  label: string;
  value: string;
};

type ProductItem = {
  id: string;
  name: string;
  gearRatio: string;
  torque: string;
  efficiency: string;
  manufacturer: string;
  price: string;
};

// Reusable Component cho các card thông tin
const InfoCard = ({ title, items, onEdit }: {
  title: string;
  items: SpecificationItem[];
  onEdit?: () => void;
}) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.cardTitle}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <FontAwesome name="pencil" size={20} color="#333" />
        </TouchableOpacity>
      )}
    </View>
    {items.map((item, index) => (
      <Text key={index} style={styles.specLine}>
        {item.label}: <Text style={styles.specValue}>{item.value}</Text>
      </Text>
    ))}
  </View>
);

// Component chính
export default function TechnicalSpecificationScreen() {
  // Dữ liệu mẫu
  const technicalSpecs: SpecificationItem[] = [
    { label: 'Motor Power', value: '5.5 kW' },
    { label: 'Input Speed', value: '1450 RPM' },
    { label: 'Output Speed', value: '120 RPM' },
    { label: 'Torque', value: '440 Auto' },
    { label: 'Gear ratio', value: '12.08 Nm' },
  ];

  const installationSpecs: SpecificationItem[] = [
    { label: 'Load Type', value: 'Medium Load' },
    { label: 'Operating Time per Day', value: '8 - 16 hours' },
    { label: 'Working Environment', value: 'Normal' },
    { label: 'Orientation', value: 'Worm Gear, Horizontal, Direct Shaft' },
  ];

  const relatedItems: ProductItem[] = [
    {
      id: '1',
      name: 'SEW R47',
      gearRatio: '12.1',
      torque: '450 Nm',
      efficiency: '96%',
      manufacturer: 'SEW',
      price: '15,500,000 VND',
    },
    // Thêm các item khác...
  ];

  // Render sản phẩm liên quan
  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.name}</Text>
      <View style={styles.specContainer}>
        <Text style={styles.specText}>Ratio: {item.gearRatio}</Text>
        <Text style={styles.specText}>Torque: {item.torque}</Text>
        <Text style={styles.specText}>Eff: {item.efficiency}</Text>
        <Text style={styles.specText}>{item.manufacturer}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Enter product code or keyword"
        placeholderTextColor="#888"
      />

      {/* Technical Specs */}
      <InfoCard
        title="Technical Specifications"
        items={technicalSpecs}
        onEdit={() => console.log('Edit technical specs')}
      />

      {/* Installation Type */}
      <InfoCard
        title="Installation type"
        items={installationSpecs}
      />

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        {['Price', 'Efficiency', 'Popularity'].map((filter) => (
          <TouchableOpacity key={filter} style={styles.filterButton}>
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Related Products */}
      <Text style={styles.sectionTitle}>Related Products</Text>
      <FlatList
        horizontal
        data={relatedItems}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  specLine: {
    fontSize: 14,
    color: '#4A5568',
    marginVertical: 4,
  },
  specValue: {
    fontWeight: '500',
    color: '#1A202C',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  filterButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: {
    color: '#4A5568',
    fontWeight: '500',
  },
  productList: {
    paddingBottom: 16,
  },
  productCard: {
    width: 240,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    elevation: 2,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  specContainer: {
    gap: 4,
  },
  specText: {
    fontSize: 14,
    color: '#4A5568',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B6CB0',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginVertical: 12,
  },
});