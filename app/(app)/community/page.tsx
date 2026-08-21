"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerItem } from "@/frontend/lib/motion-presets";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Modal } from "@/frontend/components/ui/modal";
import { MessageCircle, Heart, PenLine, Send, MoreHorizontal, Flag, Ban, Loader2 } from "lucide-react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  getCommunityPosts,
  createCommunityPost,
  toggleLikePost,
  addComment,
  reportItem,
  blockUser
} from "@/backend/actions/community";

const TAGS = ["Latest", "Exam Stress", "Loneliness", "Success Stories", "Mental Health", "Memes"];

import { GuestPrompt } from "@/frontend/components/auth/guest-prompt";

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTag, setActiveTag] = useState("Latest");
  
  // Post Creation
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("Exam Stress");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comments & Interactions
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [interactionLoading, setInteractionLoading] = useState<string | null>(null);

  // Moderation
  const [modPostId, setModPostId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchPosts(currentUser.uid, activeTag);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [activeTag]);

  const fetchPosts = async (uid: string, tag: string) => {
    setLoading(true);
    const res = await getCommunityPosts(uid, tag);
    if (res.success && res.posts) {
      setPosts(res.posts);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!user || user.isAnonymous || !newPostContent.trim()) return;
    setIsSubmitting(true);
    const res = await createCommunityPost(user.uid, newPostContent, newPostTag);
    if (res.success) {
      setIsPostModalOpen(false);
      setNewPostContent("");
      await fetchPosts(user.uid, activeTag);
    }
    setIsSubmitting(false);
  };

  const handleLike = async (postId: string) => {
    if (!user || user.isAnonymous) return;
    setInteractionLoading(postId);
    const res = await toggleLikePost(user.uid, postId);
    if (res.success) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const liked = res.liked;
          return {
            ...p,
            hearts: liked ? p.hearts + 1 : p.hearts - 1,
            likes: liked ? [{ userId: user.uid }] : []
          };
        }
        return p;
      }));
    }
    setInteractionLoading(null);
  };

  const handleAddComment = async (postId: string) => {
    if (!user || user.isAnonymous || !commentText.trim()) return;
    setCommentingPostId(postId);
    const res = await addComment(user.uid, postId, commentText);
    if (res.success) {
      setCommentText("");
      await fetchPosts(user.uid, activeTag);
    }
    setCommentingPostId(null);
  };

  const handleReport = async (postId: string) => {
    if (!user || user.isAnonymous) return;
    await reportItem(user.uid, postId, "POST", "Inappropriate content");
    setModPostId(null);
    alert("Post reported. Thank you for keeping the community safe.");
  };

  const handleBlock = async (authorId: string) => {
    if (!user || user.isAnonymous) return;
    await blockUser(user.uid, authorId);
    setModPostId(null);
    await fetchPosts(user.uid, activeTag);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="space-y-8 max-w-3xl relative min-h-[60vh]"
    >
      <GuestPrompt feature="Community" description="Create an account to join the conversation, share anonymously, and connect with peers." />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Community</h1>
          <p className="text-white/60 font-light mt-1">You are not alone. Share anonymously.</p>
        </div>
        <Button onClick={() => setIsPostModalOpen(true)} className="gap-2 shrink-0">
          <PenLine className="w-4 h-4" />
          Share anonymously
        </Button>
      </div>

      {/* Tag filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {TAGS.map((t) => (
          <motion.button
            key={t}
            onClick={() => setActiveTag(t)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTag === t
                ? "bg-[var(--moonlit-cyan)]/20 text-white border border-[var(--moonlit-cyan)]/50 shadow-[0_0_15px_rgba(121,175,194,0.2)]"
                : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            No posts found for this tag. Be the first to share!
          </div>
        ) : (
          posts.map((post, index) => {
            const isLiked = post.likes?.length > 0;
            const isExpanded = expandedPostId === post.id;
            const timeStr = new Date(post.createdAt).toLocaleDateString();

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -2 }}
              >
              <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(121,175,194,0.1)] transition-all duration-300 relative group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--moonlit-cyan)]/10 text-xs font-medium text-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/20">
                      {post.tag || "General"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40 font-light">{timeStr}</span>
                      <div className="relative">
                        <button 
                          onClick={() => setModPostId(modPostId === post.id ? null : post.id)}
                          className="text-white/40 hover:text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {modPostId === post.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-[#06152F]/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl z-10 py-1 overflow-hidden">
                            <button onClick={() => handleReport(post.id)} className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/10 flex items-center gap-2">
                              <Flag className="w-4 h-4" /> Report
                            </button>
                            <button onClick={() => handleBlock(post.authorId)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 flex items-center gap-2">
                              <Ban className="w-4 h-4" /> Block User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/90 leading-relaxed mb-5 whitespace-pre-wrap font-light">{post.content}</p>
                  
                  <div className="flex items-center gap-5 text-white/50 border-t border-white/10 pt-4">
                    <button 
                      onClick={() => handleLike(post.id)} 
                      disabled={interactionLoading === post.id}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-[var(--accent-warm)]' : 'hover:text-[var(--accent-warm)]'}`}
                    >
                      {interactionLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />}
                      {post.hearts}
                    </button>
                    <button 
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 text-sm hover:text-[var(--moonlit-cyan)] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> {post._count.comments}
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-4"
                      >
                        <div className="space-y-3">
                          {post.comments?.map((c: any) => (
                            <div key={c.id} className="bg-white/5 border border-white/10 p-3 rounded-xl">
                              <span className="text-xs font-medium text-[var(--moonlit-cyan)] mb-1 block">
                                {c.author?.anonymousName || "Anonymous"}
                              </span>
                              <p className="text-sm text-white/80 font-light">{c.content}</p>
                              <span className="text-[10px] text-white/40 mt-1 block font-light">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a supportive comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-4 rounded-full outline-none focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50"
                          />
                          <Button 
                            size="sm" 
                            className="rounded-full px-4 bg-[var(--moonlit-cyan)]/20 hover:bg-[var(--moonlit-cyan)]/40 text-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30" 
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText.trim() || commentingPostId === post.id}
                          >
                            {commentingPostId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Share with the Community">
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">What's on your mind?</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write something supportive or share what you're going through. You are completely anonymous."
              rows={4}
              className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Tag</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.slice(1).map(t => (
                <button
                  key={t}
                  onClick={() => setNewPostTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    newPostTag === t
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button 
            className="w-full h-11 rounded-full mt-4" 
            onClick={handleCreatePost}
            disabled={isSubmitting || !newPostContent.trim()}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post Anonymously"}
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
