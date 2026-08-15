import * as motion from "framer-motion/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Wind, BookHeart, Coffee, MapPin } from "lucide-react";

const resources = [
  { title: "5-Minute Breathing", category: "Audio", icon: Wind, bg: "bg-[#EFF8F1]", iconColor: "text-[#2E7D5B]" },
  { title: "Lo-Fi Study Beats", category: "Music", icon: Headphones, bg: "bg-[#F0F5FF]", iconColor: "text-[#5B7FD4]" },
  { title: "Overcoming Perfectionism", category: "Reading", icon: BookHeart, bg: "bg-[#FFF6ED]", iconColor: "text-[#D4875B]" },
  { title: "Morning Grounding", category: "Audio", icon: Coffee, bg: "bg-[#FFF8EE]", iconColor: "text-[#D4A45B]" },
];

export default function ComfortPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-display font-semibold text-[#1F2937] tracking-tight">Comfort Library</h1>
        <p className="text-[#667085] mt-1">Curated resources to help you decompress and reset.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {resources.map((res, i) => (
          <Card key={i} className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.1)] transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-2xl ${res.bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                <res.icon className={`w-6 h-6 ${res.iconColor}`} />
              </div>
              <p className="text-xs font-semibold text-[#98A2B3] uppercase tracking-wider mb-1">{res.category}</p>
              <h3 className="text-base font-semibold text-[#1F2937] leading-snug">{res.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiet Space CTA */}
      <div className="rounded-2xl bg-[#1F5D43] overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
              <MapPin className="w-3.5 h-3.5" /> Campus Feature
            </div>
            <h2 className="text-2xl font-display font-semibold text-white mb-2">Need a quiet space?</h2>
            <p className="text-white/70 leading-relaxed max-w-md">
              Find the least crowded study rooms and silent zones on campus — updated in real time.
            </p>
          </div>
          <Button className="bg-[#DDF2E3] text-[#1F5D43] hover:bg-white font-semibold shrink-0 h-12 px-6">
            Open Campus Map
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
