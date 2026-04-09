import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SubjectFilterProps {
  subjects: string[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  getSubjectIcon?: (subject: string) => keyof typeof Ionicons.glyphMap;
  getSubjectColor?: (subject: string) => string;
  showIcons?: boolean;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematiques: "#EAB308",
  Physique: "#7c3aed",
  Chimie: "#059669",
  Francais: "#dc2626",
  Histoire: "#d97706",
  Philosophie: "#4f46e5",
  Anglais: "#0891b2",
  SVT: "#16a34a",
  Informatique: "#2563eb",
  "Toutes": "#6d7698",
  "Réseaux Informatiques": "#2563eb",
  "Génie Logiciel": "#7c3aed",
  "Bases de Données": "#059669",
  "Développement Web": "#dc2626",
  "Systèmes d'Exploitation": "#d97706",
  "Sécurité Informatique": "#dc2626",
  "Intelligence Artificielle": "#4f46e5",
  Programmation: "#0891b2",
};

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mathematiques: "calculator",
  Physique: "nuclear",
  Chimie: "flask",
  Francais: "book",
  Histoire: "time",
  Philosophie: "school",
  Anglais: "globe",
  SVT: "leaf",
  Informatique: "code-slash",
  "Toutes": "grid",
  "Réseaux Informatiques": "wifi",
  "Génie Logiciel": "code-slash",
  "Bases de Données": "server",
  "Développement Web": "globe",
  "Systèmes d'Exploitation": "desktop",
  "Sécurité Informatique": "shield-checkmark",
  "Intelligence Artificielle": "hardware-chip",
  Programmation: "terminal",
};

export function SubjectFilter({
  subjects,
  selectedSubject,
  onSelectSubject,
  getSubjectIcon,
  getSubjectColor,
  showIcons = false,
}: SubjectFilterProps) {
  const resolveIcon = (subject: string) => {
    const iconFn = getSubjectIcon || ((s: string) => SUBJECT_ICONS[s] || "document-text");
    return iconFn(subject);
  };

  const resolveColor = (subject: string) => {
    const colorFn = getSubjectColor || ((s: string) => SUBJECT_COLORS[s] || "#6d7698");
    return colorFn(subject);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
    >
      {subjects.map((subject) => {
        const isSelected = subject === selectedSubject;
        const color = resolveColor(subject);

        return (
          <TouchableOpacity
            key={subject}
            onPress={() => onSelectSubject(subject)}
            activeOpacity={0.7}
            className="flex-row items-center px-4 py-2 rounded-full"
            style={{
              backgroundColor: isSelected ? color : "#F3F4F6",
            }}
          >
            {showIcons && (
              <Ionicons
                name={resolveIcon(subject)}
                size={14}
                color={isSelected ? "#FFFFFF" : color}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              className="text-xs font-semibold"
              style={{
                color: isSelected ? "#FFFFFF" : "#374151",
              }}
            >
              {subject}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
