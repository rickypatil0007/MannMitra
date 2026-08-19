import { useState } from "react";
import { Brain, Mic, MessageSquare } from "lucide-react";
import { useMitraChat } from "../hooks/useMitraChat";
import { MitraMessageList } from "./MitraMessageList";
import { MitraInput } from "./MitraInput";

interface MitraChatProps {
  firebaseUid: string | null;
  conversationId: string | null;
  initialMessages?: any[];
}

export function MitraChat({ firebaseUid, conversationId, initialMessages }: MitraChatProps) {
  const [isListening, setIsListening] = useState(false);
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    chatState,
    retry
  } = useMitraChat({
    firebaseUid,
    conversationId,
    initialMessages,
  });

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange({ target: { value: input ? input + " " + transcript : transcript } } as any);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center shadow-soft">
            <Brain className="w-5 h-5 text-[var(--accent-ai)]" />
          </div>
          <div>
            <p className="text-base font-display font-semibold text-[var(--text-primary)]">Mitra</p>
            <p className="text-xs text-[var(--text-muted)]">Private AI companion</p>
          </div>
        </div>
      </div>

      <MitraMessageList 
        messages={messages} 
        chatState={chatState} 
        onRetry={retry}
      />

      <MitraInput 
        input={input}
        handleInputChange={handleInputChange as any}
        handleSubmit={handleSubmit}
        chatState={chatState}
        startListening={startListening}
        isListening={isListening}
      />
    </div>
  );
}
