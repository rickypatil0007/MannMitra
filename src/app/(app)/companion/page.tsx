"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Search, Mic, MicOff, Users, Compass, UserCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  POPULAR_INTERESTS, 
  searchCompanions, 
  getMatchLabel, 
  MatchResult, 
  Companion,
  companionDemoData
} from "@/lib/companion-demo";

// Polyfill for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function CompanionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Search State
  const [query, setQuery] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Microphone State
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [browserSupported, setBrowserSupported] = useState(true);

  // Profile Modal State
  const [selectedProfile, setSelectedProfile] = useState<MatchResult | Companion | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false; // We don't want it to run forever, just for a single query
        reco.interimResults = true;
        reco.lang = "en-US";

        reco.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          if (finalTranscript) {
             setQuery(prev => prev ? `${prev} ${finalTranscript}`.trim() : finalTranscript);
          }
        };

        reco.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            alert("Microphone access was denied. Please allow microphone permissions to use voice search.");
          }
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      } else {
        setBrowserSupported(false);
      }
    }
  }, []);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const toggleListen = () => {
    if (!browserSupported) {
      alert("Voice search isn't supported in this browser. You can use text search instead.");
      return;
    }
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleChip = (interest: string) => {
    setSelectedChips(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() && selectedChips.length === 0) {
      alert("Please enter an interest or choose at least one interest.");
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    }

    setHasSearched(true);
    const matchResults = searchCompanions(query, selectedChips);
    setResults(matchResults);
  };

  const exploreAll = () => {
    setQuery("");
    setSelectedChips([]);
    setHasSearched(true);
    // Display all with basic mapping
    const all = companionDemoData.map(c => ({
       ...c, 
       sharedInterests: [],
       matchScore: 0
    }));
    setResults(all);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col h-auto min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full pb-10">
      
      {/* Header */}
      <header className="flex flex-col mb-8 shrink-0">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5 text-[var(--primary)]" />
          </div>
          Find Your Companion
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-xl">
          Search by interests, hobbies, study goals, or career interests to find a peer who understands your journey.
        </p>
      </header>

      {/* Search Interface */}
      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for someone who shares your interests..." 
              className={cn(
                "w-full h-14 rounded-xl pl-12 pr-12 bg-[var(--surface-secondary)] text-base transition-all duration-300",
                isListening && "border-[var(--danger)] ring-1 ring-[var(--danger)]"
              )}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={toggleListen}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full transition-colors",
                isListening ? "text-[var(--danger)] hover:text-red-600 hover:bg-red-50" : "text-[var(--text-muted)] hover:text-[var(--primary)]"
              )}
              title="Use Microphone"
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
          <Button 
            type="submit" 
            className="h-14 px-8 rounded-xl shrink-0 font-semibold"
          >
            Search Companions
          </Button>
        </form>

        {/* Popular Interests Chips */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Popular Interests</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleChip(interest)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  selectedChips.includes(interest)
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-secondary)]"
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {results.length > 0 ? `${results.length} companions found` : "Recommended Companions"}
          </h2>
          
          {results.length === 0 ? (
            <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl">
              <Compass className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No close matches found.</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm mx-auto">
                Try adding a broader interest or searching for another topic.
              </p>
              <Button variant="outline" onClick={exploreAll}>
                Explore All Companions
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {results.map((companion, idx) => {
                  const matchLabel = getMatchLabel(companion.matchScore);
                  // Default format: display all interests as a string joined by dots
                  const interestString = companion.interests.join(" • ");

                  return (
                    <motion.div
                      key={companion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--primary-soft)] hover:shadow-soft transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex gap-4 items-start">
                          <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                            <UserCircle2 className="w-7 h-7 text-[var(--text-muted)]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight">
                              {companion.anonymousName}
                            </h3>
                            <p className="text-[var(--text-secondary)] text-xs mt-1 font-medium">
                              {interestString}
                            </p>
                            <p className="text-[var(--text-primary)] text-sm mt-3 italic text-muted-foreground border-l-2 border-[var(--primary-soft)] pl-3 py-0.5">
                              "{companion.bio}"
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-3 mt-4 sm:mt-0 shrink-0 min-w-[140px]">
                          {companion.matchScore > 0 && (
                            <div className={cn("px-3 py-1 rounded-full text-xs font-semibold border", matchLabel.color, "border-current/20")}>
                              {Math.min(99, 40 + (companion.matchScore * 20))}% Interest Match
                            </div>
                          )}
                          <Button variant="secondary" size="sm" onClick={() => setSelectedProfile(companion)} className="w-full sm:w-auto">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Profile Modal */}
      <Modal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} title="Companion Profile">
        {selectedProfile && (
          <div className="space-y-6 mt-2 pb-4">
            <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center shrink-0">
                <UserCircle2 className="w-10 h-10 text-[var(--text-muted)]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedProfile.anonymousName}</h2>
                <div className="flex items-center gap-1.5 text-xs text-[var(--success)] font-medium mt-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                  Active Now
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">About</h4>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">"{selectedProfile.bio}"</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Availability</h4>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                       <Clock className="w-4 h-4 text-[var(--primary)]" />
                       {selectedProfile.availability}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Match Strength</h4>
                    {('matchScore' in selectedProfile && selectedProfile.matchScore > 0) ? (
                      <span className="text-sm font-semibold text-[var(--primary)]">
                        {Math.min(99, 40 + (selectedProfile.matchScore * 20))}% Match
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">N/A</span>
                    )}
                  </div>
               </div>

               <div>
                 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Interests</h4>
                 <div className="flex flex-wrap gap-1.5">
                   {selectedProfile.interests.map((int: string) => (
                     <span key={int} className="px-2.5 py-1 rounded-md text-xs bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
                       {int}
                     </span>
                   ))}
                 </div>
               </div>

               {'sharedInterests' in selectedProfile && (selectedProfile as MatchResult).sharedInterests.length > 0 && (
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-2">Shared Interests</h4>
                   <div className="flex flex-wrap gap-1.5">
                     {(selectedProfile as MatchResult).sharedInterests.map((int: string) => (
                       <span key={int} className="px-2.5 py-1 rounded-md text-xs bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20">
                         {int}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
               <Button className="w-full h-12 text-md font-semibold rounded-xl" onClick={() => {
                 alert(`Demo Connect: Connection request sent to ${selectedProfile.anonymousName}!`);
                 setSelectedProfile(null);
               }}>
                 Connect
               </Button>
               <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                 Your identity remains completely anonymous during the initial connection phase.
               </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
