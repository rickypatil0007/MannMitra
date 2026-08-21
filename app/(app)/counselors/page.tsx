"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card"
import { StaggerContainer, StaggerItem } from "@/frontend/components/ui/animated"
import { Search, Calendar, Star, MapPin, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/frontend/components/ui/input"
import Image from "next/image"

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Academic Stress", "Depression"],
    availability: "Next available: Tomorrow, 2:00 PM",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Michael Chen, LPC",
    title: "Licensed Professional Counselor",
    specialties: ["Relationships", "Identity", "Trauma"],
    availability: "Next available: Thursday, 10:00 AM",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Dr. Elena Rodriguez",
    title: "Campus Psychiatrist",
    specialties: ["ADHD", "Sleep Disorders", "Medication Management"],
    availability: "Next available: Next Monday",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=5"
  }
]

export default function CounselorsPage() {
  return (
    <StaggerContainer className="space-y-8">
      
      {/* Header */}
      <StaggerItem>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">Professional Support</h1>
          <p className="text-white/60 font-light mt-2 max-w-xl">
            Book a confidential session with a verified campus counselor. Your professors and peers will never know.
          </p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            placeholder="Search by name or specialty..." 
            className="pl-10 h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/40 backdrop-blur-md rounded-2xl focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50"
          />
        </div>
      </header>
      </StaggerItem>

      {/* Directory */}
      <div className="grid lg:grid-cols-2 gap-6">
        {counselors.map((c, i) => (
          <StaggerItem key={c.id}>
          <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 hover:shadow-[0_0_20px_rgba(121,175,194,0.15)] hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 h-full">
            <div className="sm:w-1/3 shrink-0 p-6 sm:pr-0 flex flex-col items-center sm:items-start justify-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[var(--moonlit-cyan)]/30 shadow-lg mb-4 group-hover:scale-105 transition-transform duration-500">
                <Image src={c.image} alt={c.name} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-[var(--accent-warm)] bg-[var(--accent-warm)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-warm)]/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                {c.rating}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-display font-medium text-white">{c.name}</h3>
              <p className="text-sm text-[var(--moonlit-cyan)] font-light mb-3">{c.title}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {c.specialties.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10 font-light">
                    {s}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/50 font-light">
                  <Clock className="w-4 h-4 shrink-0 text-[var(--moonlit-cyan)]/70" />
                  {c.availability}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50 font-light">
                  <MapPin className="w-4 h-4 shrink-0 text-[var(--moonlit-cyan)]/70" />
                  Student Health Center, Room {200 + c.id}
                </div>
              </div>
              
              <Button className="w-full mt-6 rounded-xl group/btn bg-[var(--moonlit-cyan)]/20 hover:bg-[var(--moonlit-cyan)]/40 text-[var(--moonlit-cyan)] hover:text-white border border-[var(--moonlit-cyan)]/30 transition-all">
                Book Session
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          </motion.div>
          </StaggerItem>
        ))}
      </div>

    </StaggerContainer>
  )
}
