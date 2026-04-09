import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Bonjour 👋 Je suis ton assistant IA. Pose-moi une question !",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // 🤖 FAKE RESPONSE
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "Je réfléchis encore 😄 (branche ton backend ici)",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View className={`mb-3 px-4 ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`px-4 py-3 rounded-2xl max-w-[80%] ${
            isUser
              ? "bg-primary rounded-br-sm"
              : "bg-neutral rounded-bl-sm"
          }`}
        >
          <Text className={`text-sm ${isUser ? "text-black" : "text-on-surface"}`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <View > {/* ✅ IMPORTANT */}
  
            {/* HEADER */}
            <View className="px-4 py-3 border-b border-neutral">
              <Text className="text-lg font-bold text-primary text-center">
                Assistant IA
              </Text>
            </View>
  
            {/* CHAT */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{
                flexGrow: 1,          // ✅ prend tout l'espace même vide
                paddingVertical: 10,
                justifyContent: "flex-end", // ✅ messages collés en bas
              }}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
  
          </View>
        </TouchableWithoutFeedback>
  
        {/* INPUT toujours en bas */}
        <View className="flex-row items-center px-3 py-2 border-t border-neutral bg-surface">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écris ton message..."
            className="flex-1 bg-neutral rounded-full px-4 py-3 text-on-surface"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
  
          <TouchableOpacity
            onPress={handleSend}
            className="ml-2 bg-primary p-3 rounded-full"
            disabled={!input.trim()}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={input.trim() ? "#000" : "#6B7280"} 
            />
          </TouchableOpacity>
        </View>
  
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}