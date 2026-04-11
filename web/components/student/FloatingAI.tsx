import { Sparkles, Send } from "lucide-react";

export default function FloatingAI() {
  return (
    <div className="fixed bottom-8 right-8 w-96 bg-surface-variant/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,35,111,0.1)] p-6 z-50 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h5 className="text-sm font-bold text-on-surface">Curator AI</h5>
          <p className="text-[10px] text-tertiary-container font-bold uppercase tracking-widest">
            Active • Research Mode
          </p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm border border-slate-100">
          I've summarized the key findings from "Neuro-Ethics" (L1). Would you
          like me to generate revision cards for the exam?
        </div>
      </div>
      <div className="relative">
        <input
          className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-6 pr-14 text-sm shadow-sm focus:ring-2 focus:ring-primary/10"
          placeholder="Ask Curator..."
          type="text"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4 ml-[-2px]" />
        </button>
      </div>
    </div>
  );
}
