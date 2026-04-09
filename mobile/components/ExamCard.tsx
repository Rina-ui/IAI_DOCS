import React from "react";
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { Exam } from "@/types";

interface ExamCardProps {
  exam: Exam;
  onPress?: (exam: Exam) => void;
  onDownload?: (exam: Exam) => void;
  isDownloading?: boolean;
  height?: number;
  showDownload?: boolean;
  imageSource?: any;
}

export function ExamCard({
  exam,
  onPress,
  onDownload,
  isDownloading = false,
  height = 180,
  showDownload = false,
  imageSource,
}: ExamCardProps) {
  const defaultImage = require("@/assets/images/maths.jpg");

  const handleDownload = (e: React.PointerEvent) => {
    e.stopPropagation();
    onDownload?.(exam);
  };

  return (
    <TouchableOpacity
  activeOpacity={0.9}
  onPress={() => onPress?.(exam)}
  className="rounded-2xl overflow-hidden"
  style={{ height, width: "48%" }} // ✅ AJOUT IMPORTANT
>
      <ImageBackground
        source={imageSource || defaultImage}
        style={{ flex: 1 }}
        resizeMode="none"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View className="p-4">
            {/* Badge matière */}
            <View className="bg-white/20 px-3 py-1.5 rounded-full self-start mb-2">
              <Text className="text-xs text-white font-semibold">
                {exam.subject.substring(0, 18)}
              </Text>
            </View>

            {/* Titre */}
            <Text
              className="text-white font-bold text-base mb-1"
              numberOfLines={2}
            >
              {exam.title.substring(0, 20)}
            </Text>

            {/* Footer */}
            <View className="flex-row items-center justify-between">
              <Text className="text-white/70 text-xs">
                {exam.year}
              </Text>

              {showDownload && (
                <TouchableOpacity
                  onPress={() => onDownload?.(exam)}
                  className="bg-white/20 p-2 rounded-full"
                  activeOpacity={0.7}
                  disabled={isDownloading}
                >
                  <Ionicons
                    name={isDownloading ? "hourglass" : "download-outline"}
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
