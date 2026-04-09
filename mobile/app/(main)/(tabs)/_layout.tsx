import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

const PRIMARY = "#EAB308";
const INACTIVE = "#000";

const tabs = [
  {
    name: "home/home",
    title: "Accueil",
    icon: "home-outline" as const,
    iconFocused: "home" as const,
  },
  {
    name: "epreuves/epreuves",
    title: "Épreuves",
    icon: "document-text-outline" as const,
    iconFocused: "document-text" as const,
  },
  {
    name: "forum/forum",
    title: "Forum",
    icon: "chatbubbles-outline" as const,
    iconFocused: "chatbubbles" as const,
  },
] as const;

function TabIcon({
  focused,
  icon,
  iconFocused,
}: {
  focused: boolean;
  icon: any;
  iconFocused: any;
  title: string;
}) {
  return (
    <View
      className=""
    >
      <Ionicons
        name={focused ? iconFocused : icon}
        size={20}
        color={focused ? PRIMARY : INACTIVE}
      />
      
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ✅ FIX COULEUR LABEL
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          marginHorizontal: 24,
          height: 68,
          borderRadius: 34,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingBottom: 0,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          }}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={tab.icon}
                iconFocused={tab.iconFocused}
                title={tab.title}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}