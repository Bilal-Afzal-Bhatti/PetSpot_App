import React from "react";
import { Stack } from "expo-router";

export default function BlogLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="cat-care/index"
        options={{ headerShown: true, title: "Cat Care", headerStyle: { backgroundColor: "#D86B35" }, headerTintColor: "#ffffff" }}
      />
      <Stack.Screen
        name="dog-care/index"
        options={{ headerShown: true, title: "Dog Care", headerStyle: { backgroundColor: "#D86B35" }, headerTintColor: "#ffffff" }}
      />
      <Stack.Screen
        name="[slug]/index"
        options={{ headerShown: true, title: "Blog Post", headerStyle: { backgroundColor: "#D86B35" }, headerTintColor: "#ffffff" }}
      />
    </Stack>
  );
}