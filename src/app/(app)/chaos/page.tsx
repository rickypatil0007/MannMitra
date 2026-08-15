"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <header className="text-center space-y-4 mb-10 pt-4">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Chaos to Clarity.</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Overwhelmed? Just dump everything on your mind below. Don't worry about formatting, grammar, or making sense. We'll extract the action items.
        </p>
      </header>

      {tasks.length === 0 ? (
        <div className="space-y-4">
          <textarea
            value={chaosText}
            onChange={(e) => setChaosText(e.target.value)}
            placeholder="I have to email my professor about the midterm because I was sick, and also I need to read chapter 4 for sociology, oh and I keep forgetting to pay the internet bill, plus my mom called yesterday and I haven't called her back yet..."
            className="w-full min-h-[300px] p-6 text-lg bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all placeholder:text-muted-foreground/60 leading-relaxed"
          />
          <div className="flex justify-end">
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
          </div>
        </div>
      ) : (
        <Card className="glass-panel border-primary/20 animate-in zoom-in-95 duration-500">
          <CardHeader className="text-center border-b border-border/50 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">Here's what you need to do.</CardTitle>
            <CardDescription>We extracted {tasks.length} action items from your dump.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {tasks.map(task => (
              <label 
                key={task.id} 
                className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={task.done} 
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-5 h-5 rounded-full border-2 border-primary/30 text-primary focus:ring-primary/30 checked:bg-primary"
                />
                <span className={task.done ? "text-muted-foreground line-through transition-all" : "text-foreground transition-all"}>
                  {task.text}
                </span>
              </label>
            ))}
          </CardContent>
          <div className="p-6 pt-0 flex justify-between">
            <Button variant="ghost" onClick={() => setTasks([])}>Start Over</Button>
            <Button className="rounded-xl group">
              Save to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
