"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/shared";
import { User, Bell, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const sections = ["Profile", "Notifications", "Privacy", "Account"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-3xl"
    >
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] w-fit flex-wrap">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeSection === s
                ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {activeSection === "Profile" && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary-hover)] font-bold font-display text-xl">
                  A
                </div>
                <div>
                  <p className="text-base font-semibold text-[var(--text-primary)]">Alex Student</p>
                  <p className="text-sm text-[var(--text-secondary)]">alex@university.edu</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">First name</label>
                  <Input defaultValue="Alex" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Last name</label>
                  <Input defaultValue="Student" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Email address</label>
                <Input type="email" defaultValue="alex@university.edu" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">University / Institution</label>
                <Input defaultValue="State University" />
              </div>
              <div className="flex items-center justify-between pt-2">
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-[var(--primary)] font-medium">
                    <CheckCircle className="w-4 h-4" /> Changes saved
                  </span>
                )}
                <Button onClick={handleSave} className="ml-auto">Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "Notifications" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-[var(--primary-soft)]" />Notification preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Daily wellness check-in reminder", description: "Get a gentle reminder to log how you're feeling.", enabled: true },
              { label: "Planner deadline alerts", description: "Reminders 24h before task deadlines.", enabled: true },
              { label: "Community replies", description: "When someone replies to your anonymous posts.", enabled: false },
              { label: "Counsellor updates", description: "Status updates on your support requests.", enabled: true },
            ].map((pref) => (
              <div key={pref.label} className="flex items-start justify-between gap-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{pref.label}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{pref.description}</p>
                </div>
                <div className={`flex-shrink-0 w-10 h-6 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--surface)] shadow-sm transition-all ${pref.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeSection === "Privacy" && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4 text-[var(--primary-soft)]" />Privacy controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Anonymous community posts", description: "Your real name is never shown in the community feed.", enabled: true, locked: true },
                { label: "Wellness data usage", description: "Allow aggregated (anonymized) wellness trends to help improve the platform.", enabled: false, locked: false },
                { label: "AI conversation analysis", description: "Allow Mitra to reference past conversations for better context.", enabled: true, locked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.description}</p>
                    {item.locked && <span className="text-[10px] text-[var(--text-muted)] font-medium">Cannot be disabled — core privacy protection</span>}
                  </div>
                  <div className={`flex-shrink-0 w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"} ${item.locked ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--surface)] shadow-sm transition-all ${item.enabled ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] p-4">
            <p className="text-sm font-semibold text-[var(--danger)]">Delete account & data</p>
            <p className="text-xs text-[var(--danger)]/80 mt-1 mb-3">Permanently remove your account and all associated data. This cannot be undone.</p>
            <Button variant="danger" size="sm">Request account deletion</Button>
          </div>
        </div>
      )}

      {activeSection === "Account" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4 text-[var(--primary-soft)]" />Change password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Current password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">New password</label>
              <Input type="password" placeholder="At least 8 characters" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Confirm new password</label>
              <Input type="password" placeholder="Repeat new password" />
            </div>
            <Button className="w-full">Update password</Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
