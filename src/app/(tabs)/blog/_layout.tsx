import React from "react";
import { Stack } from "expo-router";

export default function BlogLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cat-care/index" />
      <Stack.Screen name="dog-care/index" />
      <Stack.Screen name="[slug]/index" />
    </Stack>
  );
}