"use client";

import { useState } from "react";
import { Sparkles, Send, X, Minus } from "lucide-react";

export default function FloatingAI() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Merci pour votre question. Je suis en cours de développement et je pourrai bientôt vous aider avec vos révisions !",
        },
      ]);
    }, 1000);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-primary to-tertiary rounded-full shadow-lg flex items-center justify-center text-on-primary hover:scale-110 transition-transform z-50"
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 bg-surface backdrop-blur-2xl rounded-3xl shadow-2xl z-50 border border-secondary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-tertiary rounded-full flex items-center justify-center text-on-primary">
            <Sparkles size={20} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-on-surface">Assistant IA</h5>
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
              Actif • Mode recherche
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 text-secondary hover:bg-neutral rounded-lg transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 text-secondary hover:bg-neutral rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                  ? "bg-primary text-on-primary rounded-br-none"
                  : "bg-neutral text-on-surface rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-secondary/10">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-neutral border-none rounded-full py-3 px-4 text-sm text-on-surface placeholder:text-secondary/60 focus:ring-2 focus:ring-primary/50"
            placeholder="Posez votre question..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
