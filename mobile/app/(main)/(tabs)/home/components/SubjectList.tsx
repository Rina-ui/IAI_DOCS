import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { SubjectGroup } from "@/types";

interface SubjectListProps {
  subjectGroups: SubjectGroup[];
  getSubjectColor: (subject: string) => string;
  getSubjectIcon: (subject: string) => keyof typeof Ionicons.glyphMap;
}

export function SubjectList({
  subjectGroups,
  getSubjectColor,
  getSubjectIcon,
}: SubjectListProps) {
  const router = useRouter();

  if (subjectGroups.length === 0) return null;

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 px-6">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-primary rounded-full mr-2" />
          <Text className="text-on-surface font-bold text-xl">
            Matières
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push("/(main)/epreuves/epreuves")}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Text className="text-primary font-semibold text-sm mr-1">Tout voir</Text>
          <Ionicons name="arrow-forward" size={14} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Cards Container */}
      <View className="px-6">
        {subjectGroups.map((group, i) => (
          <TouchableOpacity
            key={group.subject}
            className="bg-surface rounded-2xl mb-3"
            onPress={() => router.push("/(main)/epreuves/epreuves")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between px-4 py-4">
              {/* Left Section - Icon & Info */}
              <View className="flex-row items-center flex-1">
                {/* Icon Container */}
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: getSubjectColor(group.subject) + "15" }}
                >
                  <Ionicons
                    name={getSubjectIcon(group.subject)}
                    size={22}
                    color={getSubjectColor(group.subject)}
                  />
                </View>
                
                {/* Subject Info */}
                <View className="flex-1">
                  <Text className="text-on-surface font-semibold text-base mb-0.5">
                    {group.subject}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary opacity-60 mr-1" />
                    <Text className="text-secondary text-xs">
                      {group.count} épreuve{group.count > 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Section - Chevron */}
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color="#9CA3AF" 
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}