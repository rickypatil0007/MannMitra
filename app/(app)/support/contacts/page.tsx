"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { PageHeader, Badge } from "@/frontend/components/ui/shared";
import { Shield, Phone, Plus, User, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import Link from "next/link";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getTrustedContacts, addTrustedContact, deleteTrustedContact } from "@/backend/actions/support";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}

export default function TrustedContactsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchContacts(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchContacts = useCallback(async (uid: string) => {
    setLoading(true);
    const res = await getTrustedContacts(uid);
    if (res.success && res.contacts) {
      setContacts(res.contacts as Contact[]);
    }
    setLoading(false);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !phone.trim()) return;
    
    setSubmitting(true);
    await addTrustedContact(user.uid, name, phone, relationship);
    await fetchContacts(user.uid);
    
    // Reset form
    setName("");
    setPhone("");
    setRelationship("");
    setShowAddForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (contactId: string) => {
    if (!user) return;
    await deleteTrustedContact(user.uid, contactId);
    await fetchContacts(user.uid);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-3xl"
    >
      <Link href="/support" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Support
      </Link>

      <PageHeader 
        title="Trusted Contacts" 
        description="People you trust to be notified in an emergency."
        action={
          !showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Contact
            </Button>
          )
        }
      />

      <div className="bg-[var(--accent-warm)]/10 border border-[var(--accent-warm)]/20 rounded-2xl p-4 flex gap-3 items-start backdrop-blur-sm">
        <Shield className="w-5 h-5 text-[var(--accent-warm)] shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--accent-warm)]/90">
          <p className="font-medium mb-1 text-[var(--accent-warm)]">How SOS works</p>
          <p className="font-light leading-relaxed">When you trigger the silent SOS, these contacts will immediately receive an SMS with your location and a request to check on you. We will never contact them without your explicit SOS trigger.</p>
        </div>
      </div>

      {showAddForm && (
        <div className="border border-[var(--moonlit-cyan)]/40 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(121,175,194,0.15)]">
          <div className="p-6">
            <h3 className="font-medium text-white mb-4">Add New Contact</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Name *</label>
                  <Input 
                    required 
                    placeholder="e.g., Jane Doe" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Phone Number *</label>
                  <Input 
                    required 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-white/70">Relationship (Optional)</label>
                  <Input 
                    placeholder="e.g., Parent, Friend" 
                    value={relationship} 
                    onChange={e => setRelationship(e.target.value)} 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="text-white/50 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-[var(--moonlit-cyan)] hover:bg-[var(--moonlit-cyan)]/90 text-white shadow-lg">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact, i) => (
            <div key={contact.id} className="relative overflow-hidden group border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 transition-all duration-200">
              {i === 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <Badge variant="green" className="text-[10px] bg-[var(--moonlit-cyan)]/20 text-[var(--moonlit-cyan)] border-[var(--moonlit-cyan)]/30">Primary SOS</Badge>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${i === 0 ? 'bg-[var(--moonlit-cyan)]/20 text-[var(--moonlit-cyan)] border-[var(--moonlit-cyan)]/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{contact.name}</h3>
                    <p className="text-sm text-white/50 font-light">{contact.relationship || "Contact"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 text-sm text-white/70 font-mono font-light">
                    <Phone className="w-4 h-4 text-white/40" /> {contact.phone}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0 rounded-full text-white/30 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center p-8 text-white/50 hover:text-white hover:border-[var(--moonlit-cyan)]/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(121,175,194,0.1)] transition-all group backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--moonlit-cyan)]/20 group-hover:border-[var(--moonlit-cyan)]/30 group-hover:text-[var(--moonlit-cyan)] flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-medium font-light">{contacts.length === 0 ? "Add your first contact" : "Add another contact"}</p>
            </button>
          )}
        </div>
      )}

    </motion.div>
  );
}
