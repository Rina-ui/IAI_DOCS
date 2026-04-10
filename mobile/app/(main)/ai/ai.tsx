import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis ton assistant IAI. Comment puis-je t'aider dans tes révisions aujourd'hui ?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const userText = input.toLowerCase();
      let aiResponse = "";

      if (userText.includes("epreuv") || userText.includes("examen") || userText.includes("test")) {
        aiResponse = "Pour beneficier de la correction IA, selectionnez une epreuve dans la section 'Epreuves', puis cliquez sur 'Passer l'examen'. L'IA corrigera automatiquement vos reponses !";
      } else if (userText.includes("aider") || userText.includes("help") || userText.includes("comment")) {
        aiResponse = "Voici comment utiliser IAI DOCS :\n\n1. Allez dans 'Epreuves' pour voir les examens disponibles\n2. Selectionnez une epreuve et cliquez sur 'Passer l'examen'\n3. Repondez aux questions\n4. Soumettez pour obtenir votre correction IA avec score et explications\n\nBonnes revisions !";
      } else if (userText.includes("bonjour") || userText.includes("salut") || userText.includes("hello")) {
        aiResponse = "Bonjour ! Pret a reviser ? Je vous recommande de choisir une epreuve dans la section 'Epreuves' et de la passer pour obtenir une correction IA detaillee. Bon courage !";
      } else {
        aiResponse = "Je suis l'assistant IAI DOC. Pour obtenir une correction IA, rendez-vous dans la section 'Epreuves', choisissez un examen et cliquez sur 'Passer l'examen'. L'IA analysera vos reponses et vous donnera un score detaille !";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <View style={{ marginBottom: 16, paddingHorizontal: 16, alignItems: isUser ? "flex-end" : "flex-start" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          {!isUser && (
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#EAB308", alignItems: "center", justifyContent: "center", marginRight: 8, marginBottom: 4 }}>
              <Ionicons name="sparkles" size={16} color="white" />
            </View>
          )}

          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 16,
              borderBottomRightRadius: isUser ? 4 : 16,
              borderBottomLeftRadius: isUser ? 16 : 4,
              maxWidth: "85%",
              backgroundColor: isUser ? "#EAB308" : "#FFFFFF",
              borderColor: isUser ? "transparent" : "#E5E7EB",
              borderWidth: 1,
            }}
          >
            <Text style={{ fontSize: 15, lineHeight: 22, color: isUser ? "#FFFFFF" : "#1F2937" }}>
              {item.text}
            </Text>
            <Text style={{ fontSize: 10, marginTop: 4, alignSelf: "flex-end", color: isUser ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>
              {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>

          {isUser && (
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginLeft: 8, marginBottom: 4 }}>
              <Ionicons name="person" size={16} color="#64748B" />
            </View>
          )}
        </View>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={{ flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, marginBottom: 16 }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#EAB308", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
        <Ionicons name="sparkles" size={16} color="white" />
      </View>
      <View style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderBottomLeftRadius: 4, height: 40, justifyContent: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB", marginRight: 4 }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB", marginRight: 4 }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB" }} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "bottom"]}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* HEADER */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "#F8FAFC" }}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#0F172A", marginRight: 4 }}>
                Assistant IAI
              </Text>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" }} />
            </View>
            <Text style={{ fontSize: 12, color: "#64748B" }}>En ligne</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* CHAT AREA */}
          <FlatList
            ref={flatListRef}
            data={messages}
            style={{ flex: 1 }}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (isTyping ? <TypingIndicator /> : null)}
          />

          {/* INPUT AREA */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#F1F5F9" }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: "#E2E8F0" }}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Posez votre question..."
                style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: "#1F2937" }}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={!input.trim()}
                style={{ opacity: input.trim() ? 1 : 0.5 }}
              >
                <LinearGradient
                  colors={["#EAB308", "#CA8A04"]}
                  style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }}
                >
                  <Ionicons name="arrow-up" size={22} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", marginTop: 8 }}>
              L'IA peut faire des erreurs. Verifiez les informations importantes.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}
