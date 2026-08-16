"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CompanionPage() {
  const [messages, setMessages] = React.useState([
    { id: 1, role: "assistant", content: "Hi there. I'm here to listen. You can talk to me about anything that's on your mind—in any language." }
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: input }])
    setInput("")
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: "assistant", 
        content: "I hear you. It sounds like you're carrying a lot right now. Do you want to try breaking some of that down together, or do you just need to vent?" 
      }])
      setIsTyping(false)
    }, 1500)
  }

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="flex flex-col mb-6 shrink-0">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-secondary-foreground" />
          </div>
          Companion
        </h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl">
          Everything you say here is completely private and encrypted. This is a safe space to vent, process, or just think out loud.
        </p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "max-w-[85%] sm:max-w-[75%] rounded-3xl px-6 py-4 text-base",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                  : "glass-panel rounded-tl-sm text-foreground"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-panel rounded-3xl rounded-tl-sm px-6 py-4 flex items-center gap-1.5 h-14">
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Disclaimer */}
      <div className="shrink-0 flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
        <AlertCircle className="w-3.5 h-3.5" />
        Companion is an AI, not a therapist. In an emergency, please use the Safety Center.
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="shrink-0 relative mt-2">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type whatever is on your mind..." 
          className="h-16 pl-6 pr-16 rounded-full shadow-sm glass-panel border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50 text-base"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim()}
          className="absolute right-2 top-2 rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-[var(--primary-foreground)] shadow-sm transition-transform active:scale-95 disabled:opacity-40"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>

    </div>
  )
}
