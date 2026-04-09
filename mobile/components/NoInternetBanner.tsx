import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";

export default function NoInternetBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  const showBanner = () => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0,  useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity,    { toValue: 1,  useNativeDriver: true, duration: 250 }),
    ]).start();
  };

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, useNativeDriver: true, duration: 300 }),
      Animated.timing(opacity,    { toValue: 0,    useNativeDriver: true, duration: 300 }),
    ]).start();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;

      if (offline) {
        setIsOffline(true);
        setWasOffline(true);
        showBanner();
      } else if (wasOffline) {
        // Connexion rétablie → afficher brièvement "Reconnecté"  puis masquer
        setIsOffline(false);
        setTimeout(() => hideBanner(), 2000);
      }
    });

    return () => unsubscribe();
  }, [wasOffline]);

  if (!isOffline && !wasOffline) return null;

  return (
    <Animated.View
      style={[styles.banner, isOffline ? styles.offline : styles.online, { transform: [{ translateY }], opacity }]}
    >
      <Ionicons
        name={isOffline ? "cloud-offline-outline" : "cloud-done-outline"}
        size={18}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {isOffline
          ? "Pas de connexion internet"
          : "✓ Connexion rétablie"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position:        "absolute",
    top:             0,
    left:            0,
    right:           0,
    zIndex:          9999,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    paddingTop:      52,   // safe area
    paddingBottom:   14,
    paddingHorizontal: 20,
  },
  offline: { backgroundColor: "#ef4444" },
  online:  { backgroundColor: "#22c55e" },
  icon:    { marginRight: 8 },
  text: {
    color:      "#fff",
    fontSize:   14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
