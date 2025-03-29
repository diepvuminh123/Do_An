// app/(tabs)/account.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function AccountScreen() {
  const handleLogout = () => {
    // Giả lập logout → quay lại màn hình login
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Tài khoản của bạn</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>example@email.com</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>Nguyễn Văn A</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04101F',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: 15,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 40,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
