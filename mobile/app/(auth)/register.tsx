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

const LEVELS = [
  "6ème",
  "5ème",
  "4ème",
  "3ème",
  "Seconde",
  "Première",
  "Terminale",
  "L1",
  "L2",
  "L3",
  "Master",
];

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [level, setLevel] = useState("Terminale");
  const [showPassword, setShowPassword] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        level,
      });
      router.replace("/(main)/(tabs)/home/home");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.";
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
        contentContainerClassName="flex-grow px-8 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/images/iai_logo.jpeg")}
            className="w-20 h-20 mb-3"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-on-surface text-center">
            Créer un compte
          </Text>
          
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* First Name & Last Name */}
          <View className="flex-col gap-3">
            <View >
              <Text className="text-lg font-semibold text-on-surface mb-2">
                Prénom
              </Text>
              <View className="flex-row items-center border border-neutral rounded-xl px-3 py-3 bg-neutral/50">
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#6B7280"
                  className="mr-2"
                />
                <TextInput
                  className="flex-1 text-base text-on-surface"
                  placeholder="Prénom"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View >
              <Text className="text-lg font-semibold text-on-surface mb-2">
                Nom
              </Text>
              <View className="flex-row items-center border border-neutral rounded-xl px-3 py-3 bg-neutral/50">
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#6B7280"
                  className="mr-2"
                />
                <TextInput
                  className="flex-1 text-base text-on-surface"
                  placeholder="Nom"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View>
            <Text className="text-lg font-semibold text-on-surface mb-2">
              Email
            </Text>
            <View className="flex-row items-center border border-neutral rounded-xl px-3 py-3 bg-neutral/50">
              <Ionicons
                name="mail-outline"
                size={18}
                color="#6B7280"
                className="mr-2"
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
            <View className="flex-row items-center border border-neutral rounded-xl px-3 py-3 bg-neutral/50">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#6B7280"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-base text-on-surface"
                placeholder="Min. 8 caractères"
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
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Level */}
          <View>
            <Text className="text-lg font-semibold text-on-surface mb-2">
              Niveau
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-neutral rounded-xl px-3 py-3 bg-neutral/50"
              onPress={() => setShowLevels(!showLevels)}
            >
              <Ionicons
                name="school-outline"
                size={18}
                color="#6B7280"
                className="mr-2"
              />
              <Text className="flex-1 text-base text-on-surface">{level}</Text>
              <Ionicons
                name={showLevels ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6B7280"
              />
            </TouchableOpacity>

            {showLevels && (
  <View className="mt-2 bg-surface border border-neutral rounded-xl overflow-hidden max-h-48">
    
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
      {LEVELS.map((lvl) => (
        <TouchableOpacity
          key={lvl}
          className="px-4 py-3 border-b border-neutral"
          onPress={() => {
            setLevel(lvl);
            setShowLevels(false);
          }}
        >
          <Text
            className={`text-base ${
              level === lvl
                ? "text-primary font-semibold"
                : "text-on-surface"
            }`}
          >
            {lvl}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

  </View>
)}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center mt-4"
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">
                S'inscrire
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-secondary">Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text className="text-primary font-semibold">Se connecter</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
