// app/_layout.tsx
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    const isLoggedIn = false; // ← giả lập chưa đăng nhập
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
