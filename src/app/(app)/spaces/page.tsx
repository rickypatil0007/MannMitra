"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, Badge, EmptyState } from "@/components/ui/shared";
import { MapPin, VolumeX, Users, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuietSpaces } from "@/actions/spaces";

interface SpaceData {
  id: string;
  name: string;
  location: string;
  description: string | null;
  capacity: number | null;
  noiseLevel: string;
  isAvailable: boolean;
  features: string[];
}

import { GuestPrompt } from "@/components/auth/guest-prompt";

export default function SpacesPage() {
  const [filter, setFilter] = useState("All");
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    const res = await getQuietSpaces();
    if (res.success && res.spaces) {
      setSpaces(res.spaces as SpaceData[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // For the MVP, we map DB features/noise to the mock types so the UI looks identical
  const getSpaceType = (space: SpaceData) => {
    if (space.features.includes("wellness")) return "Wellness";
    if (space.features.includes("outdoors")) return "Outdoors";
    return "Study";
  };

  const filtered = filter === "All" ? spaces : spaces.filter(s => getSpaceType(s) === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl relative min-h-[60vh]"
    >
      <GuestPrompt feature="Spaces" description="Create an account to discover and navigate to quiet study and wellness spaces on campus." />
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
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--background-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-soft)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={<Navigation className="w-10 h-10" />}
          title="No spaces found"
          description={filter === "All" ? "No spaces have been added to the database yet." : `No spaces of type ${filter} found.`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((space) => {
            const type = getSpaceType(space);
            return (
              <Card key={space.id} className="hover:shadow-soft hover:border-[var(--primary-soft)] transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={type === "Wellness" ? "green" : "muted"}>{type}</Badge>
                    <div className="flex items-center gap-1 text-sm text-[var(--primary)] font-medium bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">
                      <MapPin className="w-3.5 h-3.5" /> {space.location}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{space.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-subtle)] pt-4 mb-5">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><VolumeX className="w-3.5 h-3.5" /> Noise Level</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{space.noiseLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Capacity</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{space.capacity ? `${space.capacity} max` : "N/A"}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-[var(--background-secondary)] text-[var(--primary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--primary-hover)] border border-[var(--primary-soft)] gap-2 shadow-none">
                    <Navigation className="w-4 h-4" /> Get Directions
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </motion.div>
  );
}
