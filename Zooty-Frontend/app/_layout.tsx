import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/role-selection" />
      <Stack.Screen name="onboarding/register-user" />
      <Stack.Screen name="onboarding/complete-profile" />
      <Stack.Screen name="profesional/registro/register" />
      <Stack.Screen name="profesional/registro/specialty" />
      <Stack.Screen name="profesional/registro/services" />
    </Stack>
  );
}
