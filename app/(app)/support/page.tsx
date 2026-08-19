"use client";

import { useState, useEffect, useCallback } from "react";
import * as motion from "framer-motion/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { PageHeader, EmptyState } from "@/frontend/components/ui/shared";
import { CalendarHeart, Users, ShieldAlert, Phone, MessageSquare, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getMyCounsellingRequests, requestCounselling } from "@/backend/actions/support";

const counsellors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specialties: ["Academic Stress", "Anxiety", "Burnout"],
    availability: "Available: Mon, Wed, Fri",
  },
  {
    id: 2,
    name: "Anand Verma, LPC",
    title: "Licensed Counselor",
    specialties: ["Identity", "Relationships", "Transition"],
    availability: "Available: Tue, Thu",
  },
  {
    id: 3,
    name: "Dr. Kavitha Nair",
    title: "Wellness Counselor",
    specialties: ["Depression", "Sleep", "Self-Esteem"],
    availability: "Next slot: Thursday 3 PM",
  },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

interface RequestData {
  id: string;
  status: string;
  notes: string | null;
  requestedAt: string | Date;
}

export default function SupportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchRequests(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRequests = useCallback(async (uid: string) => {
    setLoading(true);
    const res = await getMyCounsellingRequests(uid);
    if (res.success && res.requests) {
      setRequests(res.requests as RequestData[]);
    }
    setLoading(false);
  }, []);

  const handleRequestChat = async (counsellor: typeof counsellors[0]) => {
    if (!user) return;
    setSubmittingId(counsellor.id);
    const notes = `Requested chat with ${counsellor.name}`;
    await requestCounselling(user.uid, notes);
    await fetchRequests(user.uid);
    setSubmittingId(null);
  };

  const isPending = (counsellorName: string) => {
    return requests.some((req) => req.status === "pending" && req.notes?.includes(counsellorName));
  };
  const isAccepted = (counsellorName: string) => {
    return requests.some((req) => (req.status === "scheduled" || req.status === "accepted") && req.notes?.includes(counsellorName));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-8 max-w-4xl"
    >
      <PageHeader
        title="Support & Counseling"
        description="Professional help is always within reach. You don't have to navigate this alone."
      />

      {/* Emergency strip */}
      <div className="rounded-2xl bg-[var(--danger-soft)] border border-[#FECACA] p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[var(--danger)] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--danger)]">In immediate danger? Don&apos;t wait.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href="tel:112" className="flex items-center gap-1.5 px-4 py-2 bg-[var(--danger)] text-[var(--primary-foreground)] text-sm font-semibold rounded-full hover:bg-[#b03b3b] transition-colors">
                <Phone className="w-4 h-4" /> Emergency — 112
              </a>
              <a href="tel:9152987821" className="flex items-center gap-1.5 px-4 py-2 border border-[#FECACA] text-[var(--danger)] text-sm font-semibold rounded-full hover:bg-[#FECACA]/20 transition-colors">
                <Phone className="w-4 h-4" /> iCall — 9152987821
              </a>
              <a href="sms:iCall" className="flex items-center gap-1.5 px-4 py-2 border border-[#FECACA] text-[var(--danger)] text-sm font-semibold rounded-full hover:bg-[#FECACA]/20 transition-colors">
                <MessageSquare className="w-4 h-4" /> Text iCall
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Counsellors directory */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">Schedule a Chat</h2>
        <p className="text-sm text-[var(--text-secondary)]">All sessions are free and completely confidential. A simple &ldquo;I&apos;d like to talk&rdquo; is enough.</p>

        <div className="space-y-4">
          {counsellors.map((c) => {
            const pending = isPending(c.name);
            const accepted = isAccepted(c.name);
            const status = accepted ? "accepted" : pending ? "pending" : null;
            
            return (
              <Card key={c.id} className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0 text-[var(--primary-hover)] font-bold font-display text-sm">
                      {initials(c.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{c.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{c.title}</p>
                        </div>
                        {status === "pending" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFF6ED] text-[#7A4A1E] border border-[#FFD9AE] font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {status === "accepted" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary-hover)] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Accepted
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.specialties.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] text-[10px] font-medium text-[var(--text-secondary)]">
                            {s}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-[var(--text-muted)] mt-2">{c.availability}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex gap-2 justify-end">
                    <Button variant="secondary" size="sm">View Profile</Button>
                    <Button 
                      size="sm" 
                      disabled={status !== null || submittingId === c.id}
                      onClick={() => handleRequestChat(c)}
                    >
                      {submittingId === c.id ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                      ) : status === "pending" ? (
                        "Request sent"
                      ) : (
                        "Request a Chat"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Group support & Requests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <CardTitle className="text-base">Group Support Sessions</CardTitle>
            <CardDescription>Join a facilitated small group with other students facing similar pressures.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Explore Groups</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mb-3">
              <CalendarHeart className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <CardTitle className="text-base">My Support Requests</CardTitle>
            <CardDescription>Track the status of your counsellor requests and upcoming sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
                </div>
              ) : requests.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No active requests</p>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--primary-soft)]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--primary-soft)]" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--primary-hover)]">{req.notes || "General Request"}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)} · 
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                      req.status === 'pending' 
                        ? "bg-[#FFF6ED] text-[#7A4A1E]" 
                        : "bg-[var(--primary-soft)] text-[var(--primary-hover)]"
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200 lg:col-span-2">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <CardTitle className="text-base">Privacy & Data Support</CardTitle>
            <CardDescription>Get help with managing your data, withdrawing consent, or understanding our security practices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              <p>
                <strong>DPDP Act & SPDI Rules:</strong> MannMitra applies reasonable security practices to protect personal information. Your consent is required before we collect any data.
              </p>
              <p>
                To withdraw consent or request data deletion, please contact our Data Protection Officer at:
              </p>
              <a href="mailto:privacy@mannmitra.edu" className="font-medium text-[var(--primary)] hover:underline">
                privacy@mannmitra.edu
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
