import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace("/(main)/(tabs)/home/home");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur de connexion. Vérifiez vos identifiants.";
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-1 justify-center px-8 py-12">
          {/* Logo */}
          <View className="items-center mb-12">
            <Image
              source={require("../../assets/images/iai_logo.jpeg")}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-on-surface text-center">
              IAI DOCS
            </Text>
            <Text className="text-base text-secondary text-center mt-2">
              Connectez-vous pour continuer
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {/* Email */}
            <View>
              <Text className="text-lg font-semibold text-on-surface mb-2">
                Email
              </Text>
              <View className="flex-row items-center border border-neutral rounded-xl px-4 py-3 bg-neutral/50">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-base text-on-surface"
                  placeholder="votre@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-lg font-semibold text-on-surface mb-2">
                Mot de passe
              </Text>
              <View className="flex-row items-center border border-neutral rounded-xl px-4 py-3 bg-neutral/50">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-base text-on-surface"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center mt-4"
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Se connecter
                </Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-secondary">Pas encore de compte ? </Text>
                <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
                  <Text className="text-primary font-semibold">
                    S'inscrire
                  </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
