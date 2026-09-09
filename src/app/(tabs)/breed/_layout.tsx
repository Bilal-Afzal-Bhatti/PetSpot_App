import { Stack } from 'expo-router';

export default function BreedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cat-breed" />
      <Stack.Screen name="dog-breed" />
    </Stack>
  );
}