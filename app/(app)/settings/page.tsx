"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { PageHeader } from "@/frontend/components/ui/shared";
import { User, Bell, Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getUserProfile, updateUserProfile } from "@/backend/actions/user";

const sections = ["Profile", "Notifications", "Privacy", "Account"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institution: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const res = await getUserProfile(currentUser.uid);
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const res = await updateUserProfile(user.uid, {
      firstName: profile.firstName,
      lastName: profile.lastName,
      institution: profile.institution
    });
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const getInitials = () => {
    if (profile.firstName) return profile.firstName.charAt(0).toUpperCase();
    return "A";
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-3xl"
    >
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="flex gap-1 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 w-fit flex-wrap">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeSection === s
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-white/50 font-light hover:text-white/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {activeSection === "Profile" && (
        <div className="space-y-5">
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--moonlit-cyan)]/20 border border-[var(--moonlit-cyan)]/30 flex items-center justify-center text-[var(--moonlit-cyan)] font-medium font-display text-xl">
                  {getInitials()}
                </div>
                <div>
                  <p className="text-base font-medium text-white/90">{profile.firstName} {profile.lastName}</p>
                  <p className="text-sm text-white/50 font-light">{profile.email}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-light text-white/60">First name</label>
                  <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-light text-white/60">Last name</label>
                  <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-light text-white/60">Email address</label>
                <Input type="email" value={profile.email} disabled className="opacity-60 bg-white/5 border-white/10 text-white cursor-not-allowed" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-light text-white/60">University / Institution</label>
                <Input value={profile.institution} onChange={(e) => setProfile({ ...profile, institution: e.target.value })} className="bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
              </div>
              <div className="flex items-center justify-between pt-2">
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-[var(--moonlit-cyan)] font-medium">
                    <CheckCircle className="w-4 h-4" /> Changes saved
                  </span>
                )}
                <Button onClick={handleSave} disabled={saving} className="ml-auto bg-[var(--moonlit-cyan)]/80 text-white hover:bg-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "Notifications" && (
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-base font-medium flex items-center gap-2 text-white/90"><Bell className="w-4 h-4 text-[var(--moonlit-cyan)]" />Notification preferences</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Daily wellness check-in reminder", description: "Get a gentle reminder to log how you're feeling.", enabled: true },
              { label: "Planner deadline alerts", description: "Reminders 24h before task deadlines.", enabled: true },
              { label: "Community replies", description: "When someone replies to your anonymous posts.", enabled: false },
              { label: "Counsellor updates", description: "Status updates on your support requests.", enabled: true },
            ].map((pref) => (
              <div key={pref.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white/90">{pref.label}</p>
                  <p className="text-xs text-white/50 font-light mt-0.5">{pref.description}</p>
                </div>
                <div className={`flex-shrink-0 w-10 h-6 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? "bg-[var(--moonlit-cyan)]" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${pref.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "Privacy" && (
        <div className="space-y-5">
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-base font-medium flex items-center gap-2 text-white/90"><Eye className="w-4 h-4 text-[var(--moonlit-cyan)]" />Privacy controls</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Anonymous community posts", description: "Your real name is never shown in the community feed.", enabled: true, locked: true },
                { label: "Wellness data usage", description: "Allow aggregated (anonymized) wellness trends to help improve the platform.", enabled: false, locked: false },
                { label: "AI conversation analysis", description: "Allow Mitra to reference past conversations for better context.", enabled: true, locked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white/90">{item.label}</p>
                    <p className="text-xs text-white/50 font-light mt-0.5">{item.description}</p>
                    {item.locked && <span className="text-[10px] text-[var(--moonlit-cyan)]/70 font-light">Cannot be disabled — core privacy protection</span>}
                  </div>
                  <div className={`flex-shrink-0 w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-[var(--moonlit-cyan)]" : "bg-white/10"} ${item.locked ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${item.enabled ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 backdrop-blur-md">
            <p className="text-sm font-medium text-red-400">Delete account & data</p>
            <p className="text-xs text-red-400/70 font-light mt-1 mb-3">Permanently remove your account and all associated data. This cannot be undone.</p>
            <Button variant="danger" size="sm" className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">Request account deletion</Button>
          </div>
        </div>
      )}

      {activeSection === "Account" && (
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-base font-medium flex items-center gap-2 text-white/90"><Lock className="w-4 h-4 text-[var(--moonlit-cyan)]" />Change password</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-light text-white/60">Current password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10 bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-light text-white/60">New password</label>
              <Input type="password" placeholder="At least 8 characters" className="bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-light text-white/60">Confirm new password</label>
              <Input type="password" placeholder="Repeat new password" className="bg-white/5 border-white/10 text-white focus-visible:ring-[var(--moonlit-cyan)]/50" />
            </div>
            <Button className="w-full bg-[var(--moonlit-cyan)]/80 text-white hover:bg-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30">Update password</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
