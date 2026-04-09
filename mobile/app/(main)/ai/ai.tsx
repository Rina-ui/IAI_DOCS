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
  Animated,
  Dimensions,
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
      text: "Bonjour ! Je suis ton assistant IAI. Comment puis-je t'aider dans tes révisions aujourd'hui ? 🎓",
      sender: "ai",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Tu peux me dire qu'elle epreuve tu souhaiterais resoudre",
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

  // Scroll to bottom when messages change
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

    // 🤖 FAKE RESPONSE
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, l'IA est indisponible pour le moment. Nous travaillons à sa mise en ligne très prochainement ! 🛠️",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 2000);

  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === "user";
    const isLast = index === messages.length - 1;

    return (
      <View className={`mb-4 px-4 ${isUser ? "items-end" : "items-start"}`}>
        <View className="flex-row items-end">
          {!isUser && (
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 mb-1 shadow-sm">
              <Ionicons name="sparkles" size={16} color="white" />
            </View>
          )}
          
          <View
            style={{
              shadowColor: isUser ? "#EAB308" : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isUser ? 0.2 : 0.05,
              shadowRadius: 4,
            }}
            className={`px-4 py-3 rounded-2xl max-w-[85%] ${
              isUser
                ? "bg-primary rounded-br-none"
                : "bg-white border border-neutral/50 rounded-bl-none"
            }`}
          >
            <Text 
              className={`text-[15px] leading-20 ${
                isUser ? "text-white font-medium shadow-sm" : "text-slate-800"
              }`}
            >
              {item.text}
            </Text>
            <Text 
              className={`text-[10px] mt-1 self-end ${
                isUser ? "text-white/80" : "text-slate-400"
              }`}
            >
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          {isUser && (
            <View className="w-8 h-8 rounded-full bg-slate-200 items-center justify-center ml-2 mb-1">
              <Ionicons name="person" size={16} color="#64748b" />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <Animated.View style={{ height:'100%', opacity: fadeAnim }}>


        
        {/* HEADER */}
        <View className="px-4 py-4 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
          >
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          
          <View className="items-center">
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-slate-900 mr-1">
                Assistant IAI
              </Text>
              <View className="w-2 h-2 rounded-full bg-green-500" />
            </View>
            <Text className="text-xs text-slate-500">En ligne</Text>
          </View>

          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-slate-50">
            <Ionicons name="ellipsis-horizontal" size={20} color="#0f172a" />
          </TouchableOpacity>
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
            className="flex-1"
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}

            ListFooterComponent={() => (
              isTyping ? (
                <View className="flex-row items-start px-4 mb-4">
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 shadow-sm">
                    <Ionicons name="sparkles" size={16} color="white" />
                  </View>
                  <View className="bg-white border border-neutral/50 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm h-10 justify-center">
                    <View className="flex-row space-x-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                      <View className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <View className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </View>
                  </View>
                </View>
              ) : null
            )}
          />

          {/* INPUT AREA */}
          <View className="px-4 py-3 bg-white border-t border-slate-100">
            <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 py-1 border border-slate-200">
              <TouchableOpacity className="mr-2">
                <Ionicons name="add-circle-outline" size={24} color="#64748b" />
              </TouchableOpacity>
              
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Posez votre question..."
                className="flex-1 py-3 text-slate-800 text-[15px]"
                placeholderTextColor="#94a3b8"
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={!input.trim()}
                style={{ opacity: input.trim() ? 1 : 0.5 }}
              >
                <LinearGradient
                  colors={["#EAB308", "#CA8A04"]}
                  className="w-10 h-10 rounded-xl items-center justify-center shadow-sm"
                >
                  <Ionicons name="arrow-up" size={22} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text className="text-[10px] text-slate-400 text-center mt-2">
              L'IA peut faire des erreurs. Vérifiez les informations importantes.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}