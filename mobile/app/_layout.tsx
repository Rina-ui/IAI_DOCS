import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";
import NoInternetBanner from "@/components/NoInternetBanner";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        {/* Banner réseau — affiché par-dessus tout le contenu */}
        <NoInternetBanner />
      </View>
    </AuthProvider>
  );
}
