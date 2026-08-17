"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, Badge, EmptyState } from "@/components/ui/shared";
import { MapPin, VolumeX, Users, Navigation, Loader2, Clock, CheckCircle2, XCircle, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuietSpaces } from "@/actions/spaces";
import { GuestPrompt } from "@/components/auth/guest-prompt";

// Phase 2 Demo Data extended interface
interface SpaceData {
  id: string;
  name: string;
  location: string;
  description: string | null;
  capacity: number | null;
  occupancy?: number;
  crowdPercentage?: number;
  noiseLevel: string;
  isAvailable: boolean;
  features: string[];
}

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
    if (space.features.includes("library")) return "Library";
    if (space.features.includes("classroom")) return "Classroom";
    if (space.features.includes("wellness")) return "Wellness";
    if (space.features.includes("outdoors")) return "Outdoors";
    return "Study Room";
  };

  const getFilteredSpaces = () => {
    if (filter === "All") return spaces;
    if (filter === "Available") return spaces.filter(s => s.isAvailable && (s.crowdPercentage || 0) < 100);
    if (filter === "Quietest") return spaces.filter(s => s.noiseLevel.toLowerCase().includes("low"));
    if (filter === "Least Crowded") return spaces.sort((a, b) => (a.crowdPercentage || 0) - (b.crowdPercentage || 0));
    
    // Type filters
    return spaces.filter(s => getSpaceType(s) === filter);
  };

  const filtered = getFilteredSpaces();
  
  // Custom display filters for demo
  const filterTabs = [
    'All', 'Available', 'Quietest', 'Least Crowded', 
    'Library', 'Classroom', 'Study Room', 'Wellness', 'Outdoors'
  ];

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
        {filterTabs.map((t) => (
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
          description={filter === "All" ? "No spaces have been added to the database yet." : `No spaces matching "${filter}" found.`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((space) => {
            const type = getSpaceType(space);
            const isFull = (space.crowdPercentage || 0) >= 100 || !space.isAvailable;
            
            return (
              <Card key={space.id} className={`hover:shadow-soft hover:border-[var(--primary-soft)] transition-all duration-200 ${isFull ? 'opacity-80 bg-[var(--background-secondary)]/50' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={type === "Wellness" ? "green" : type === "Library" ? "default" : "muted"}>{type}</Badge>
                    <div className="flex items-center gap-1 text-sm text-[var(--primary)] font-medium bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">
                      <MapPin className="w-3.5 h-3.5" /> {space.location}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{space.name}</h3>
                  </div>
                  
                  {space.description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 min-h-[40px]">{space.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-[var(--border-subtle)] pt-4 mb-5">
                    {/* Status / Availability */}
                    <div className="col-span-2 flex items-center justify-between bg-[var(--surface-secondary)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {isFull ? (
                          <XCircle className="w-4 h-4 text-[var(--danger)]" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                        )}
                        <span className={`text-sm font-semibold ${isFull ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                          {isFull ? 'Unavailable / Full' : 'Available'}
                        </span>
                      </div>
                      
                      {space.crowdPercentage !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[var(--text-secondary)]">Crowd:</span>
                          <div className="w-16 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${space.crowdPercentage > 85 ? 'bg-[var(--danger)]' : space.crowdPercentage > 60 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}
                              style={{ width: `${Math.min(100, space.crowdPercentage)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[var(--text-primary)] min-w-[3ch] text-right">{space.crowdPercentage}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><VolumeX className="w-3.5 h-3.5" /> Noise Level</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{space.noiseLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Occupancy</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {space.occupancy !== undefined && space.capacity !== null
                          ? `${space.occupancy} / ${space.capacity}` 
                          : space.capacity 
                            ? `${space.capacity} max` 
                            : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  <Button 
                    disabled={isFull}
                    className={`w-full gap-2 shadow-none ${
                      isFull 
                        ? "bg-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed" 
                        : "bg-[var(--background-secondary)] text-[var(--primary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--primary-hover)] border border-[var(--primary-soft)]"
                    }`}
                  >
                    <Navigation className="w-4 h-4" /> 
                    {isFull ? "Currently Unavailable" : "Get Directions"}
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
