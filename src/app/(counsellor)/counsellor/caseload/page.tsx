"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { Users, EyeOff, Calendar, MoreVertical, FileText, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function CaseloadPage() {
  const [expandedNotesId, setExpandedNotesId] = useState<number | null>(null);

  const caseload = [
    { id: 1, name: "Student #482", year: "2nd Year", risk: "High", lastSession: "2 days ago", nextSession: "Tomorrow, 2:00 PM", condition: "Academic Burnout & Severe Anxiety", notes: "Discussed grounding techniques. Student reported 4 panic attacks this week. Assigned 4-7-8 breathing exercises." },
    { id: 2, name: "Student #391", year: "3rd Year", risk: "Medium", lastSession: "1 week ago", nextSession: "Oct 15, 10:00 AM", condition: "Placement Stress", notes: "Working on interview anxiety. Recommended mock interviews with peers." },
    { id: 3, name: "Student #842", year: "1st Year", risk: "Low", lastSession: "3 days ago", nextSession: "Not scheduled", condition: "Adjustment Issues", notes: "Homesickness improving. Encouraged joining the campus robotics club." },
    { id: 4, name: "Student #105", year: "4th Year", risk: "Medium", lastSession: "Yesterday", nextSession: "Next Week", condition: "Career Anxiety", notes: "Exploring gap year options vs immediate placement. Scheduled follow-up for next week." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Active Caseload" 
          description="Manage and review the students currently assigned to your care."
        />
        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]">
          <Users className="w-4 h-4 mr-2" />
          Accept New Intake
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {caseload.map((student) => (
          <Card key={student.id} className="border-[var(--border)] shadow-soft hover:border-[var(--primary-soft)] transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-[var(--text-muted)]" />
                      {student.name}
                    </h3>
                    <Badge variant={student.risk === "High" ? "danger" : student.risk === "Medium" ? "warning" : "muted"}>
                      {student.risk} Risk
                    </Badge>
                    <Badge variant="muted">{student.year}</Badge>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Primary Focus: {student.condition}</p>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Last Session</p>
                    <p className="font-medium text-[var(--text-primary)]">{student.lastSession}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Next Session</p>
                    <p className="font-medium text-[var(--text-primary)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {student.nextSession}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant={expandedNotesId === student.id ? "default" : "outline"}
                    size="sm" 
                    className={expandedNotesId === student.id ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" : "border-[var(--border)] text-[var(--text-secondary)]"}
                    onClick={() => setExpandedNotesId(expandedNotesId === student.id ? null : student.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" /> Notes
                  </Button>
                  <Button variant="ghost" size="icon" className="text-[var(--text-muted)]">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expandable Notes Section */}
              {expandedNotesId === student.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  className="mt-5 pt-5 border-t border-[var(--border-subtle)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">Clinical Notes (Private)</h4>
                    <span className="text-xs text-[var(--text-muted)]">HIPAA Compliant Encrypted</span>
                  </div>
                  <Textarea 
                    defaultValue={student.notes} 
                    className="min-h-[100px] resize-none bg-[var(--surface-secondary)] border-[var(--border-subtle)] focus-visible:ring-[var(--primary-soft)] text-sm mb-3"
                    placeholder="Add secure case notes here..."
                  />
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-[var(--success)] hover:bg-[#166534] text-white">
                      <Save className="w-4 h-4 mr-2" /> Save Secure Note
                    </Button>
                  </div>
                </motion.div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
