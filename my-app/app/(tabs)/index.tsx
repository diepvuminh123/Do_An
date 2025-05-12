import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ứng dụng Tính Toán Hộp Giảm Tốc</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Ứng dụng này giúp bạn tính toán và thiết kế hệ thống truyền động với hộp giảm tốc cho băng tải.
        </Text>
      </View>
      
      <View style={styles.iconRow}>
        <FontAwesome name="cog" size={64} color="#4A90E2" />
        <FontAwesome name="arrow-right" size={32} color="#fff" style={styles.arrow} />
        <FontAwesome name="gears" size={64} color="#4A90E2" />
        <FontAwesome name="arrow-right" size={32} color="#fff" style={styles.arrow} />
        <FontAwesome name="file-text" size={64} color="#4A90E2" />
      </View>
      
      <Text style={styles.instructionText}>
        Bắt đầu bằng cách nhập thông số băng tải của bạn để tính toán công suất và tỉ số truyền cần thiết.
      </Text>
      
      <Link href="/(tabs)/motorConfig" style={styles.link}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Bắt Đầu Tính Toán</Text>
        </View>
      </Link>
      
      <Link href="/(tabs)/technicalSpecification" style={styles.secondaryLink}>
        <Text style={styles.linkText}>Xem thông tin kỹ thuật</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  infoContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    width: '100%',
    flexWrap: 'wrap',
  },
  arrow: {
    marginHorizontal: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryLink: {
    marginTop: 10,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});