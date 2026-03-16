import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="onboarding/register-user" />
      <Stack.Screen name="onboarding/complete-profile" />
      <Stack.Screen name="professional/register" />
      <Stack.Screen name="professional/specialty" />
      <Stack.Screen name="professional/services" />
    </Stack>
  );
}
