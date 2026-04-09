import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  showFilter?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher...",
  onFilter,
  showFilter = false,
}: SearchBarProps) {
  return (
    <View className="px-4 py-3 bg-surface">
      <View className="flex-row items-center bg-neutral rounded-xl px-3 py-2">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          className="ml-2 flex-1 text-on-surface"
        />
        {showFilter && onFilter && (
          <TouchableOpacity onPress={onFilter} className="ml-2">
            <Ionicons name="options-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
