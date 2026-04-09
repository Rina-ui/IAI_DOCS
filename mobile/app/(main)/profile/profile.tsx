import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: async () => { await logout(); router.replace("/"); } },
    ]);
  };

  if (!user) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Ionicons name="person-circle-outline" size={64} color="#9CA3AF" />
        <Text className="text-secondary mt-3">Non connecté</Text>
      </View>
    );
  }

  const roleLabel = user.role === "student" ? "Étudiant" : user.role === "teacher" ? "Enseignant" : "Admin";

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-5 bg-surface">
          <Text className="text-on-surface text-xl font-bold mb-4">Profil</Text>

          <View className="flex-row items-center mb-4">
            <View className="w-14 h-14 bg-primary rounded-xl items-center justify-center mr-4">
              <Text className="text-on-primary text-xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Text>
            </View>
            <View >
              <Text className="text-on-surface font-bold text-base">{user.firstName} {user.lastName}</Text>
              <Text className="text-secondary text-lg mt-0.5">{user.email}</Text>
              <View className="bg-neutral rounded-md px-2 py-0.5 self-start mt-1.5">
                <Text className="text-on-surface text-xs font-medium">{roleLabel}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info */}
        <View className="px-6 mt-3">
          <View className="bg-surface rounded-xl overflow-hidden">
            <InfoRow icon="school" label="Niveau" value={user.level || "—"} />
            <InfoRow icon="star" label="Points" value={`${user.points || 0}`} />
            <InfoRow icon="mail" label="Email" value={user.email} isLast />
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 mt-4">
          <Text className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Paramètres</Text>
          <View className="bg-surface rounded-xl overflow-hidden">
            <MenuItem icon="person-outline" label="Modifier le profil" />
            <MenuItem icon="notifications-outline" label="Notifications" />
            <MenuItem icon="help-circle-outline" label="Aide & Support" isLast />
          </View>
        </View>

        {/* Logout */}
        <View className="px-6 mt-6">
          <TouchableOpacity className="bg-surface border border-red-200 rounded-xl py-3 items-center" onPress={handleLogout}>
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text className="text-red-600 font-medium text-lg ml-2">Se déconnecter</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, isLast }: { icon: string; label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between px-4 py-3 ${!isLast ? "border-b border-neutral" : ""}`}>
      <View className="flex-row items-center">
        <Ionicons name={icon as any} size={18} color="#6B7280" />
        <Text className="text-on-surface text-lg ml-3">{label}</Text>
      </View>
      <Text className="text-on-surface text-lg font-medium">{value}</Text>
    </View>
  );
}

function MenuItem({ icon, label, isLast }: { icon: string; label: string; isLast?: boolean }) {
  return (
    <TouchableOpacity className={`flex-row items-center px-4 py-3 ${!isLast ? "border-b border-neutral" : ""}`}>
      <Ionicons name={icon as any} size={18} color="#6B7280" />
      <Text className="text-on-surface text-lg ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
