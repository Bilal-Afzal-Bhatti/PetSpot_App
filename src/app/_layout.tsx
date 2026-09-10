// ✅ src/app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(dogs)/for-sale/index" />
        <Stack.Screen name="(dogs)/pet/[id]" />
      
        <Stack.Screen name="(cats)/for-sale/index" />
        <Stack.Screen name="(cats)/pet/[id]" />
  
        <Stack.Screen name="pets_view/[slug]" />
        <Stack.Screen name="checkout/[id]" />
        <Stack.Screen name="orders/success" />
      </Stack>
    </GestureHandlerRootView>
  );
}