import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && !redirecting) {
      setRedirecting(true);
      router.replace("/(main)/(tabs)/home/home");
    }
  }, [loading, isAuthenticated]);

  const handleLogin = () => router.push("/(auth)/login");
  const handleRegister = () => router.push("/(auth)/register");

  // 🔄 LOADING
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#F7D117" />
        <Text className="text-white mt-4">Chargement...</Text>
      </View>
    );
  }

  // 🔄 REDIRECT
  if (isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#F7D117" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />

      {/* 🔥 Background Image FULL SCREEN */}
      <ImageBackground
        source={require("../assets/images/bg.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      >
        {/* 🔥 Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
          style={{ flex: 1 }}
        >
          <View className="flex-1">

            {/* 🔹 CONTENU CENTRÉ */}
            <View className="flex-1 items-center justify-center px-6">
              <Image
                source={require("../assets/images/iai_logo.jpeg")}
                className="w-32 h-32 mb-6"
                resizeMode="contain"
              />

              <Text className="text-4xl font-bold text-center mb-3 text-white">
                IAI DOC
              </Text>

              <Text className="text-lg text-center text-white">
                Votre plateforme d'entraînement aux examens avec correction IA
              </Text>
            </View>

            {/* 🔹 BOUTONS EN BAS */}
            <View className="gap-4 p-8">
              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center"
                onPress={handleRegister}
              >
                <Text className="text-white font-semibold">
                  S'inscrire
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-primary/20 rounded-xl py-4 items-center"
                onPress={handleLogin}
              >
                <Text className="text-primary font-semibold">
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}