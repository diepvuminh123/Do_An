import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BK MOTOR{'\n'}CALCULATOR</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don’t have account?{' '}
        <Text style={styles.signupLink}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04101F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
  },
  forgotContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#000',
  },
  signupText: {
    color: '#ccc',
  },
  signupLink: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
