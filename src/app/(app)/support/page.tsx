import * as motion from "framer-motion/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/shared";
import { CalendarHeart, Users, ShieldAlert, Phone, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

// Counsellor data - in production fetched from /api/v1/counsellors
// Using text avatars to avoid next/image external hostname errors
const counsellors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specialties: ["Academic Stress", "Anxiety", "Burnout"],
    availability: "Available: Mon, Wed, Fri",
    requestStatus: null as null | "pending" | "accepted",
  },
  {
    id: 2,
    name: "Anand Verma, LPC",
    title: "Licensed Counselor",
    specialties: ["Identity", "Relationships", "Transition"],
    availability: "Available: Tue, Thu",
    requestStatus: null as null | "pending" | "accepted",
  },
  {
    id: 3,
    name: "Dr. Kavitha Nair",
    title: "Wellness Counselor",
    specialties: ["Depression", "Sleep", "Self-Esteem"],
    availability: "Next slot: Thursday 3 PM",
    requestStatus: null as null | "pending" | "accepted",
  },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

export default function SupportPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 max-w-4xl"
    >
      <PageHeader
        title="Support & Counseling"
        description="Professional help is always within reach. You don't have to navigate this alone."
      />

      {/* Emergency strip — visually distinct from green (spec) */}
      <div className="rounded-2xl bg-[#FFF2F2] border border-[#FECACA] p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C94A4A] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#9F2F2F]">In immediate danger? Don&apos;t wait.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href="tel:112" className="flex items-center gap-1.5 px-4 py-2 bg-[#C94A4A] text-white text-sm font-semibold rounded-full hover:bg-[#b03b3b] transition-colors">
                <Phone className="w-4 h-4" /> Emergency — 112
              </a>
              <a href="tel:9152987821" className="flex items-center gap-1.5 px-4 py-2 border border-[#FECACA] text-[#9F2F2F] text-sm font-semibold rounded-full hover:bg-[#FECACA]/20 transition-colors">
                <Phone className="w-4 h-4" /> iCall — 9152987821
              </a>
              <a href="sms:iCall" className="flex items-center gap-1.5 px-4 py-2 border border-[#FECACA] text-[#9F2F2F] text-sm font-semibold rounded-full hover:bg-[#FECACA]/20 transition-colors">
                <MessageSquare className="w-4 h-4" /> Text iCall
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Counsellors directory (spec STU-18-01) */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-[#1F2937]">Schedule a Chat</h2>
        <p className="text-sm text-[#667085]">All sessions are free and completely confidential. A simple &ldquo;I&apos;d like to talk&rdquo; is enough.</p>

        <div className="space-y-4">
          {counsellors.map((c) => (
            <CounsellorCard key={c.id} counsellor={c} />
          ))}
        </div>
      </div>

      {/* Section: Group support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8F1] flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-[#2E7D5B]" />
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
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8F1] flex items-center justify-center mb-3">
              <CalendarHeart className="w-5 h-5 text-[#2E7D5B]" />
            </div>
            <CardTitle className="text-base">My Support Requests</CardTitle>
            <CardDescription>Track the status of your counsellor requests and upcoming sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF8F1] border border-[#DDF2E3]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4FA477]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1F5D43]">Dr. Priya Sharma</p>
                    <p className="text-[10px] text-[#667085]">Pending · Submitted today</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#DDF2E3] text-[#1F5D43] font-semibold">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function CounsellorCard({ counsellor }: { counsellor: typeof counsellors[0] }) {
  return (
    <Card className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar — text initials (no external images) */}
          <div className="w-12 h-12 rounded-full bg-[#DDF2E3] flex items-center justify-center flex-shrink-0 text-[#1F5D43] font-bold font-display text-sm">
            {initials(counsellor.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#1F2937]">{counsellor.name}</p>
                <p className="text-sm text-[#667085]">{counsellor.title}</p>
              </div>
              {counsellor.requestStatus === "pending" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFF6ED] text-[#7A4A1E] border border-[#FFD9AE] font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}
              {counsellor.requestStatus === "accepted" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#DDF2E3] text-[#1F5D43] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Accepted
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {counsellor.specialties.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-[#F7FBF8] border border-[#E4EDE7] text-[10px] font-medium text-[#667085]">
                  {s}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#98A2B3] mt-2">{counsellor.availability}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#EEF3EF] flex gap-2 justify-end">
          <Button variant="secondary" size="sm">View Profile</Button>
          <Button size="sm" disabled={counsellor.requestStatus !== null}>
            {counsellor.requestStatus === "pending" ? "Request sent" : "Request a Chat"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
