"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";
import { 
  Users, ShieldAlert, Clock, CheckCircle2, MessageSquare, 
  AlertTriangle, EyeOff, Lock
} from "lucide-react";
import { getActiveAlerts, markAlertAsRead } from "@/backend/actions/counselor";

export function CounsellorDashboard() {
  const [status, setStatus] = useState<"available" | "busy" | "offline">("available");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getActiveAlerts();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = async (id: string) => {
    await markAlertAsRead(id);
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      setAcknowledgedAlerts(prev => [alert, ...prev]);
    }
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Counsellor Portal</h1>
          <p className="text-white/60 font-light mt-1">Manage your caseload, review new requests, and update your status.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-lg backdrop-blur-md">
          <button onClick={() => setStatus("available")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "available" ? "bg-[var(--sky-deep)] text-white shadow-[0_0_15px_var(--sky-deep)]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>Available</button>
          <button onClick={() => setStatus("busy")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "busy" ? "bg-amber-500/80 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>Busy</button>
          <button onClick={() => setStatus("offline")} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status === "offline" ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>Offline</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Active Caseload</p>
              <p className="text-3xl font-display font-medium text-white mt-1">14</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--moonlit-cyan)]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--moonlit-cyan)]" />
            </div>
          </div>
          <p className="text-xs text-white/50 font-light mt-4">2 slots remaining</p>
        </div>

        <div className="border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] bg-red-500/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-200/80">Pending Requests</p>
              <p className="text-3xl font-display font-medium text-red-100 mt-1">3</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-red-400 font-medium mt-4">Action required</p>
        </div>
        
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">High Priority Alerts</p>
              <p className="text-3xl font-display font-medium text-white mt-1">{alerts.length}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alerts.length > 0 ? "bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-white/10"}`}>
              <ShieldAlert className={`w-5 h-5 ${alerts.length > 0 ? "text-red-500 animate-pulse" : "text-white/60"}`} />
            </div>
          </div>
          {alerts.length === 0 ? (
            <p className="text-xs text-[var(--sky-deep)] mt-4 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--sky-deep)]" /> All clear
            </p>
          ) : (
            <p className="text-xs text-red-400 mt-4 flex items-center gap-1 font-medium animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Immediate review required
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Panel: Pending Requests */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="pb-3 border-b border-white/10 p-5">
              <div className="text-lg flex items-center justify-between">
                <span className="font-display font-medium text-white/90">Pending Intake Requests</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-md text-xs font-semibold border border-red-500/30">3 New</span>
              </div>
            </div>
            <div className="p-0">
              <div className="divide-y divide-white/10">
                {[
                  { id: "req-1", reason: "Severe academic anxiety", time: "2 hours ago", priority: "Medium" },
                  { id: "req-2", reason: "Feeling isolated and lonely", time: "5 hours ago", priority: "Low" },
                  { id: "req-3", reason: "Panic attacks before exams", time: "1 day ago", priority: "High" }
                ].map((req) => (
                  <div key={req.id} className="p-5 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold border ${req.priority === "High" ? "bg-red-500/20 border-red-500/30 text-red-300" : req.priority === "Medium" ? "bg-amber-500/20 border-amber-500/30 text-amber-300" : "bg-white/10 border-white/20 text-white/60"}`}>{req.priority} Priority</span>
                          <span className="text-xs font-light text-white/50">{req.time}</span>
                        </div>
                        <h4 className="font-medium text-white/90 flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-white/50" /> Anonymous Student
                        </h4>
                        <p className="text-sm font-light text-white/60 mt-1">Stated Reason: "{req.reason}"</p>
                      </div>
                      <div className="flex gap-2 sm:shrink-0">
                        <Button size="sm" variant="outline" className="text-white/80 border-white/20 hover:bg-white/10 bg-transparent">Review</Button>
                        <Button size="sm" className="bg-[var(--moonlit-cyan)]/20 text-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30 hover:bg-[var(--moonlit-cyan)]/30 backdrop-blur-sm">Accept</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVE ALERTS */}
          {alerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-red-950/20 backdrop-blur-md rounded-2xl overflow-hidden"
            >
              <div className="pb-3 border-b border-red-500/20 p-5 bg-red-500/5">
                <div className="text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="font-display font-medium text-red-100">Crisis & High Risk Alerts</span>
                </div>
              </div>
              <div className="p-0">
                <div className="divide-y divide-red-500/10">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-5 hover:bg-red-500/5 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                              {alert.alertType.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-medium text-red-300">
                              {new Date(alert.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <h4 className="font-medium text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" /> {alert.student.name || alert.student.anonymousName || "Anonymous Student"}
                          </h4>
                          <p className="text-sm font-light text-red-200 mt-1">{alert.description}</p>
                        </div>
                        <div className="flex gap-2 sm:shrink-0">
                          <Button size="sm" variant="outline" className="text-red-300 border-red-500/30 hover:bg-red-500/10 bg-transparent">View Case</Button>
                          <Button onClick={() => handleAcknowledgeAlert(alert.id)} size="sm" className="bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel: Security & Case Notes */}
        <div className="space-y-6">
          <div className="bg-[var(--moonlit-cyan)]/5 border border-[var(--moonlit-cyan)]/20 shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--moonlit-cyan)]/10 flex items-center justify-center border border-[var(--moonlit-cyan)]/20">
                <Lock className="w-5 h-5 text-[var(--moonlit-cyan)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--moonlit-cyan)]">Private Case Notes</h3>
                <p className="text-xs font-light text-[var(--moonlit-cyan)]/70">HIPAA & FERPA Compliant</p>
              </div>
            </div>
            <p className="text-sm font-light text-[var(--moonlit-cyan)]/80 leading-relaxed mb-5">
              Select an active student from your caseload to view or add encrypted, private notes. These are never visible to the institution.
            </p>
            <Button variant="outline" className="w-full bg-transparent text-[var(--moonlit-cyan)] border-[var(--moonlit-cyan)]/30 hover:bg-[var(--moonlit-cyan)]/10">
              Open Note Editor
            </Button>
          </div>
          
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="pb-3 border-b border-white/10 p-5">
              <div className="text-base font-medium flex items-center gap-2 text-white/90">
                <MessageSquare className="w-4 h-4 text-white/70" />
                Recent Messages
              </div>
            </div>
            <div className="p-0">
              {acknowledgedAlerts.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {acknowledgedAlerts.map(alert => (
                    <div key={alert.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{alert.student.name || alert.student.anonymousName || "Anonymous"}</h4>
                          <p className="text-white/60 text-xs truncate">Email: {alert.student.email}</p>
                          <p className="text-[var(--moonlit-cyan)] text-xs mt-1 font-medium">Status: Active Case</p>
                        </div>
                        <Button size="sm" className="bg-[var(--sky-deep)] text-white hover:bg-[var(--moonlit-cyan)]">Open Chat</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/40 font-light text-sm">
                  No unread messages from active students.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
