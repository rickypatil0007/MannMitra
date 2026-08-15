"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
import { MapPin, VolumeX, Users, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const spaces = [
  { id: 1, name: "Central Library - 3rd Floor Quiet Zone", distance: "2 mins", noise: "Silent", occupancy: "Low", type: "Study" },
  { id: 2, name: "North Campus Wellness Room", distance: "5 mins", noise: "Silent", occupancy: "Medium", type: "Wellness" },
  { id: 3, name: "Engineering Block Garden", distance: "8 mins", noise: "Low", occupancy: "High", type: "Outdoors" },
  { id: 4, name: "Student Union Meditation Space", distance: "12 mins", noise: "Silent", occupancy: "Low", type: "Wellness" },
];

export default function SpacesPage() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? spaces : spaces.filter(s => s.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl"
    >
      <PageHeader 
        title="Quiet Spaces" 
        description="Find a peaceful place on campus when you need privacy or deep concentration."
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {['All', 'Study', 'Wellness', 'Outdoors'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === t
                ? "bg-[var(--green-primary)] text-white"
                : "bg-[var(--background-soft)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--background-green)] hover:text-[var(--green-primary)] hover:border-[var(--green-light)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((space) => (
          <Card key={space.id} className="hover:shadow-soft hover:border-[var(--green-light)] transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={space.type === "Wellness" ? "green" : "muted"}>{space.type}</Badge>
                <div className="flex items-center gap-1 text-sm text-[var(--green-primary)] font-medium bg-[var(--background-green)] px-2 py-0.5 rounded-md">
                  <MapPin className="w-3.5 h-3.5" /> {space.distance}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{space.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-soft)] pt-4 mb-5">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><VolumeX className="w-3.5 h-3.5" /> Noise Level</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{space.noise}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Occupancy</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{space.occupancy}</p>
                </div>
              </div>

              <Button className="w-full bg-[var(--background-soft)] text-[var(--green-primary)] hover:bg-[var(--background-green)] hover:text-[var(--green-dark)] border border-[var(--green-light)] gap-2 shadow-none">
                <Navigation className="w-4 h-4" /> Get Directions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </motion.div>
  );
}
