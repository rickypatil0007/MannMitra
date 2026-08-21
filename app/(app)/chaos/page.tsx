"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card"
import { StaggerContainer, StaggerItem } from "@/frontend/components/ui/animated"
import { BrainCircuit, Loader2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"

export default function ChaosPage() {
  const [chaosText, setChaosText] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [tasks, setTasks] = React.useState<{id: string, text: string, done: boolean}[]>([])

  const handleUntangle = () => {
    if (!chaosText.trim()) return
    setIsProcessing(true)
    
    // Simulate AI extraction
    setTimeout(() => {
      setTasks([
        { id: "1", text: "Email Professor Davis about the midterm extension", done: false },
        { id: "2", text: "Read Chapter 4 for Sociology by Thursday", done: false },
        { id: "3", text: "Pay the internet bill before the 15th", done: false },
        { id: "4", text: "Call Mom back", done: false }
      ])
      setIsProcessing(false)
    }, 2500)
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <StaggerContainer className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <StaggerItem>
      <header className="text-center space-y-4 mb-10 pt-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-[var(--moonlit-cyan)]/10 border border-[var(--moonlit-cyan)]/20 shadow-[0_0_30px_rgba(121,175,194,0.2)] rounded-3xl flex items-center justify-center mx-auto mb-2"
        >
          <BrainCircuit className="w-8 h-8 text-[var(--moonlit-cyan)]" />
        </motion.div>
        <h1 className="text-display font-display font-medium tracking-tight">Chaos to Clarity.</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Overwhelmed? Just dump everything on your mind below. Don&apos;t worry about formatting, grammar, or making sense. We&apos;ll extract the action items.
        </p>
      </header>
      </StaggerItem>

      <AnimatePresence mode="wait">
      {tasks.length === 0 ? (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <textarea
            value={chaosText}
            onChange={(e) => setChaosText(e.target.value)}
            placeholder="I have to email my professor about the midterm because I was sick, and also I need to read chapter 4 for sociology, oh and I keep forgetting to pay the internet bill, plus my mom called yesterday and I haven't called her back yet..."
            className="w-full min-h-[300px] p-6 text-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-inner focus:outline-none focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50 focus:border-[var(--moonlit-cyan)]/50 resize-none transition-all placeholder:text-white/30 text-white font-light leading-relaxed"
          />
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={handleUntangle}
              disabled={!chaosText.trim() || isProcessing}
              size="lg" 
              className="rounded-xl h-14 px-8 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Untangling...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Organize my chaos
                </>
              )}
            </Button>
            </motion.div>
          </div>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[var(--moonlit-cyan)]"
              />
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
        <div className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
          <div className="text-center border-b border-white/10 p-8 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-[var(--moonlit-cyan)]/10 text-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30 shadow-[0_0_30px_rgba(121,175,194,0.15)] p-2 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-display font-medium text-white mb-1">Here&apos;s what you need to do.</h2>
            <p className="text-white/60 font-light">We extracted {tasks.length} action items from your dump.</p>
          </div>
          <div className="p-8 pt-6 space-y-3">
            {tasks.map((task, i) => (
              <motion.label
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <input 
                  type="checkbox" 
                  checked={task.done} 
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-5 h-5 rounded-full border border-white/30 bg-transparent text-[var(--moonlit-cyan)] focus:ring-[var(--moonlit-cyan)]/30 checked:bg-[var(--moonlit-cyan)] checked:border-[var(--moonlit-cyan)] transition-colors"
                />
                <span className={`transition-all font-light ${task.done ? "text-white/40 line-through" : "text-white/90 group-hover:text-white"}`}>
                  {task.text}
                </span>
              </motion.label>
            ))}
          </div>
          <div className="p-8 pt-0 flex justify-between">
            <Button variant="ghost" onClick={() => setTasks([])} className="text-white/60 hover:text-white hover:bg-white/5">Start Over</Button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="rounded-xl group bg-[var(--moonlit-cyan)]/80 text-white hover:bg-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30">
              Save to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            </motion.div>
          </div>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </StaggerContainer>
  )
}
