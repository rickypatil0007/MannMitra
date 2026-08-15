"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Calendar, Star, MapPin, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Professional Support</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Book a confidential session with a verified campus counselor. Your professors and peers will never know.
          </p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or specialty..." 
            className="pl-10 h-12 bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-2xl"
          />
        </div>
      </header>

      {/* Directory */}
      <div className="grid lg:grid-cols-2 gap-6">
        {counselors.map(c => (
          <Card key={c.id} className="glass-panel overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            <div className="sm:w-1/3 shrink-0 p-6 sm:pr-0 flex flex-col items-center sm:items-start justify-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-background shadow-md mb-4 group-hover:scale-105 transition-transform duration-500">
                <Image src={c.image} alt={c.name} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-current" />
                {c.rating}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-display font-bold">{c.name}</h3>
              <p className="text-sm text-primary font-medium mb-3">{c.title}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {c.specialties.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                    {s}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  {c.availability}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  Student Health Center, Room {200 + c.id}
                </div>
              </div>
              
              <Button className="w-full mt-6 rounded-xl group/btn">
                Book Session
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  )
}
