"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { 
  Users, ShieldAlert, Clock, CheckCircle2, MessageSquare, 
  AlertTriangle, EyeOff, Lock
} from "lucide-react";

export function CounsellorDashboard() {
  const [status, setStatus] = useState<"available" | "busy" | "offline">("available");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Counsellor Portal" 
          description="Manage your caseload, review new requests, and update your status."
        />
        <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] p-1 rounded-lg">
          <button onClick={() => setStatus("available")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "available" ? "bg-[var(--success)] text-[var(--primary-foreground)]" : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"}`}>Available</button>
          <button onClick={() => setStatus("busy")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "busy" ? "bg-[var(--warning)] text-[var(--primary-foreground)]" : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"}`}>Busy</button>
          <button onClick={() => setStatus("offline")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "offline" ? "bg-[var(--text-muted)] text-[var(--primary-foreground)]" : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"}`}>Offline</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[var(--border)] shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Active Caseload</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">14</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--primary)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">2 slots remaining</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-soft bg-[var(--surface)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Pending Requests</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">3</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--danger-soft)] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--danger)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--danger)] font-semibold mt-4">Action required</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--border)] shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">High Priority Alerts</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">0</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> All clear
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Panel: Pending Requests */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[var(--border)] shadow-soft">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Pending Intake Requests</span>
                <Badge variant="warning">3 New</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border-subtle)]">
                {[
                  { id: "req-1", reason: "Severe academic anxiety", time: "2 hours ago", priority: "Medium" },
                  { id: "req-2", reason: "Feeling isolated and lonely", time: "5 hours ago", priority: "Low" },
                  { id: "req-3", reason: "Panic attacks before exams", time: "1 day ago", priority: "High" }
                ].map((req) => (
                  <div key={req.id} className="p-5 hover:bg-[var(--background-secondary)] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={req.priority === "High" ? "danger" : req.priority === "Medium" ? "warning" : "muted"}>{req.priority} Priority</Badge>
                          <span className="text-xs text-[var(--text-muted)]">{req.time}</span>
                        </div>
                        <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-[var(--text-muted)]" /> Anonymous Student
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Stated Reason: "{req.reason}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-[var(--text-secondary)] border-[var(--border)]">Review</Button>
                        <Button size="sm" className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]">Accept</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Security & Case Notes */}
        <div className="space-y-6">
          <Card className="bg-[var(--surface-secondary)] border-[var(--primary-soft)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--primary-hover)]">Private Case Notes</h3>
                  <p className="text-xs text-[var(--primary)]">HIPAA & FERPA Compliant</p>
                </div>
              </div>
              <p className="text-sm text-[var(--primary-hover)] leading-relaxed mb-4">
                Select an active student from your caseload to view or add encrypted, private notes. These are never visible to the institution.
              </p>
              <Button variant="outline" className="w-full bg-[var(--surface)] text-[var(--primary)] border-[var(--primary-soft)] hover:bg-[var(--background-secondary)]">
                Open Note Editor
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-[var(--border)] shadow-soft">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--text-primary)]" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                No unread messages from active students.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
