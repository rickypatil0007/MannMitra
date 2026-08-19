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

      <div className="bg-[var(--background-secondary)] border border-[var(--primary-soft)] rounded-2xl p-4 flex gap-3 items-start">
        <Shield className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--primary-hover)]">
          <p className="font-semibold mb-1">How SOS works</p>
          <p className="opacity-90 leading-relaxed">When you trigger the silent SOS, these contacts will immediately receive an SMS with your location and a request to check on you. We will never contact them without your explicit SOS trigger.</p>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-[var(--primary-soft)] border-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Add New Contact</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input 
                    required 
                    placeholder="e.g., Jane Doe" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input 
                    required 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Relationship (Optional)</label>
                  <Input 
                    placeholder="e.g., Parent, Friend" 
                    value={relationship} 
                    onChange={e => setRelationship(e.target.value)} 
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Contact
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact, i) => (
            <Card key={contact.id} className="relative overflow-hidden group">
              {i === 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <Badge variant="green" className="text-[10px]">Primary SOS</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? 'bg-[var(--surface-secondary)] text-[var(--primary)]' : 'bg-[var(--background-secondary)] text-[var(--text-secondary)]'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{contact.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{contact.relationship || "Contact"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                    <Phone className="w-4 h-4" /> {contact.phone}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0 rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center p-8 text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary-soft)] hover:bg-[var(--background-secondary)] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] group-hover:bg-[var(--surface-secondary)] flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-medium">{contacts.length === 0 ? "Add your first contact" : "Add another contact"}</p>
            </button>
          )}
        </div>
      )}

    </motion.div>
  );
}
