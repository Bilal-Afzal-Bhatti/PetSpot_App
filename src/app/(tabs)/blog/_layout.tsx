import React from "react";
import { Stack } from "expo-router";

export default function BlogLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Prevents rendering a double header inside (tabs)
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cat-care" />
      <Stack.Screen name="dog-care" />
      <Stack.Screen name="[slug]" />
    </Stack>
  );
}