import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && !redirecting) {
      setRedirecting(true);
      router.replace("/(main)/home/home");
    }
  }, [loading, isAuthenticated]);

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text className="text-on-surface mt-4">Chargement...</Text>
      </View>
    );
  }

  // If authenticated, show nothing while redirecting
  if (isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Content */}
      <View className="flex-1 justify-between px-8 py-12">
        {/* Top Section */}
        <View className="items-center pt-12">
          {/* Logo */}
          <Image
            source={require("../assets/images/iai_logo.jpeg")}
            className="w-32 h-32 mb-6"
            resizeMode="contain"
          />

          {/* Title */}
          <Text className="text-4xl font-bold text-on-primary text-center mb-3">
            IAI Docs
          </Text>
          <Text className="text-lg text-white/80 text-center leading-relaxed">
            Votre plateforme d'entraînement aux examens avec correction IA
          </Text>

          {/* Features */}
          <View className="mt-12 gap-5 w-full">
            <FeatureCard
              icon="document-text"
              title="Epreuves par matière"
              description="Accédez à des centaines d'épreuves classées par niveau et matière"
            />
            <FeatureCard
              icon="bulb"
              title="Correction IA"
              description="Recevez des feedbacks personnalisés après chaque exercice"
            />
            <FeatureCard
              icon="chatbubbles"
              title="Forum communautaire"
              description="Échangez avec d'autres étudiants et posez vos questions"
            />
          </View>
        </View>

        {/* Bottom Section - CTA Buttons */}
        <View className="gap-4 pb-8">
          <TouchableOpacity
            className="bg-white rounded-xl py-4 items-center"
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text className="text-primary text-base font-semibold">
              S'inscrire gratuitement
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white/10 rounded-xl py-4 items-center border border-white/30"
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text className="text-on-primary text-base font-semibold">
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center bg-white/10 rounded-xl p-4 border border-white/20">
      <View className="w-12 h-12 bg-white/20 rounded-lg items-center justify-center mr-4">
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View >
        <Text className="text-on-primary font-semibold text-base mb-1">
          {title}
        </Text>
        <Text className="text-white/80 text-lg leading-relaxed">
          {description}
        </Text>
      </View>
    </View>
  );
}
