import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

const tabs = [
  { name: "home/home",         title: "Accueil",  icon: "home"          },
  { name: "epreuves/epreuves", title: "Epreuves", icon: "document-text" },
  { name: "forum/forum",       title: "Forum",    icon: "chatbubbles"   },
] as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(11, 16),
          height: 80,
          marginHorizontal: 16,
          borderRadius: 70,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: { paddingVertical: 10 },
        tabBarIconStyle: { width: 24, height: 24, alignItems: "center" },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
