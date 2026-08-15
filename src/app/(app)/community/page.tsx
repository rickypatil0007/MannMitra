import * as motion from "framer-motion/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, PenLine } from "lucide-react";

const posts = [
  { tag: "Exam Stress", time: "2h ago", text: "Anyone else feel like they're completely failing despite studying for hours? The imposter syndrome is real today.", hearts: 24, replies: 7 },
  { tag: "Success Stories", time: "5h ago", text: "Just submitted my final project! It was tough but using the planner really helped me stay on track. You can do it too 🌟", hearts: 61, replies: 12 },
  { tag: "Loneliness", time: "1d ago", text: "First year is so much harder than I expected socially. Does it get easier to find your people?", hearts: 38, replies: 15 },
];

const tags = ["Latest", "Exam Stress", "Loneliness", "Success Stories", "Mental Health"];

export default function CommunityPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 max-w-3xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[#1F2937] tracking-tight">Community</h1>
          <p className="text-[#667085] mt-1">You are not alone. Share anonymously.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <PenLine className="w-4 h-4" />
          Share anonymously
        </Button>
      </div>

      {/* Tag filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {tags.map((t, i) => (
          <button
            key={t}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === 0
                ? "bg-[#2E7D5B] text-white"
                : "bg-[#F7FBF8] text-[#667085] border border-[#E4EDE7] hover:bg-[#EFF8F1] hover:text-[#2E7D5B] hover:border-[#DDF2E3]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <Card key={i} className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.08)] transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EFF8F1] text-xs font-semibold text-[#2E7D5B] border border-[#DDF2E3]">
                  {post.tag}
                </span>
                <span className="text-xs text-[#98A2B3]">{post.time}</span>
              </div>
              <p className="text-[#1F2937] leading-relaxed mb-5">{post.text}</p>
              <div className="flex items-center gap-5 text-[#98A2B3] border-t border-[#EEF3EF] pt-4">
                <button className="flex items-center gap-1.5 text-sm hover:text-[#C94A4A] transition-colors">
                  <Heart className="w-4 h-4" /> {post.hearts}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-[#2E7D5B] transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post.replies}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
