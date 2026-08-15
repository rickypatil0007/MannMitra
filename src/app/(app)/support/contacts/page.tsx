"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, Badge, EmptyState } from "@/components/ui/shared";
import { Shield, Phone, Plus, User, Heart, ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrustedContactsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 max-w-3xl"
    >
      <Link href="/support" className="inline-flex items-center gap-2 text-sm text-[#667085] hover:text-[#1F2937] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Support
      </Link>

      <PageHeader 
        title="Trusted Contacts" 
        description="People you trust to be notified in an emergency."
        action={
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        }
      />

      <div className="bg-[#F7FBF8] border border-[#DDF2E3] rounded-2xl p-4 flex gap-3 items-start">
        <Shield className="w-5 h-5 text-[#2E7D5B] shrink-0 mt-0.5" />
        <div className="text-sm text-[#1F5D43]">
          <p className="font-semibold mb-1">How SOS works</p>
          <p className="opacity-90 leading-relaxed">When you trigger the silent SOS, these contacts will immediately receive an SMS with your location and a request to check on you. We will never contact them without your explicit SOS trigger.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Mom", relation: "Family", phone: "+1 555-0198", primary: true },
          { name: "David Chen", relation: "Friend", phone: "+1 555-0231", primary: false }
        ].map((contact, i) => (
          <Card key={i} className="relative overflow-hidden group">
            {contact.primary && (
              <div className="absolute top-0 right-0 p-2">
                <Badge variant="success" className="text-[10px]">Primary SOS</Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contact.primary ? 'bg-[#EFF8F1] text-[#2E7D5B]' : 'bg-[#F7FBF8] text-[#667085]'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2937]">{contact.name}</h3>
                  <p className="text-sm text-[#667085]">{contact.relation}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#EEF3EF] pt-4">
                <div className="flex items-center gap-2 text-sm text-[#667085] font-mono">
                  <Phone className="w-4 h-4" /> {contact.phone}
                </div>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full text-[#98A2B3] group-hover:text-[#1F2937]">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <button className="border-2 border-dashed border-[#E4EDE7] rounded-xl flex flex-col items-center justify-center p-8 text-[#98A2B3] hover:text-[#2E7D5B] hover:border-[#DDF2E3] hover:bg-[#F7FBF8] transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#F7FBF8] group-hover:bg-[#EFF8F1] flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-medium">Add another contact</p>
        </button>
      </div>

    </motion.div>
  );
}
