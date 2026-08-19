"use server";

import { prisma } from "@/database/prisma";
import { PostIdentity, ReportItemType } from "@/generated/prisma/client";

// Phase 3: Community Demo Data
// Mock data structured identically to Prisma CommunityPost output
// This ensures the demo looks fully populated and emotionally authentic.
const communityDemoData = [
  // ─── EXAM STRESS ───
  {
    id: "demo-post-1",
    content: "Exams are getting close and I feel like I am falling behind everyone. No matter how many hours I sit at my desk, nothing seems to stick in my head.",
    tag: "Exam Stress",
    identity: "ANONYMOUS",
    authorId: "mock-user-1",
    hearts: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    author: { anonymousName: "Anonymous Student" },
    likes: [],
    _count: { comments: 2 },
    comments: [
      {
        id: "demo-comment-1",
        content: "You are not behind. Try breaking today's work into one small task at a time. The Pomodoro technique really saved me during finals week.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
        author: { anonymousName: "Someone Like Me" }
      },
      {
        id: "demo-comment-2",
        content: "Take a deep breath! Quality of study > quantity of hours. Take a 30 min walk and try again.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        author: { anonymousName: "Student #402" }
      }
    ]
  },
  {
    id: "demo-post-2",
    content: "I have 3 assignments due on the same day next week. Feeling incredibly paralyzed and don't even know where to start.",
    tag: "Exam Stress",
    identity: "ANONYMOUS",
    authorId: "mock-user-2",
    hearts: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    author: { anonymousName: "Student #105" },
    likes: [],
    _count: { comments: 1 },
    comments: [
      {
        id: "demo-comment-3",
        content: "Start with the easiest one just to get the momentum going. You've got this!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        author: { anonymousName: "Anonymous" }
      }
    ]
  },

  // ─── LONELINESS / MENTAL HEALTH ───
  {
    id: "demo-post-3",
    content: "I keep comparing myself with everyone around me and it is exhausting. It feels like everyone else has their life figured out except me.",
    tag: "Loneliness",
    identity: "ANONYMOUS",
    authorId: "mock-user-3",
    hearts: 156,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    author: { anonymousName: "Student" },
    likes: [],
    _count: { comments: 3 },
    comments: [
      {
        id: "demo-comment-4",
        content: "I struggled with this too. Taking one day at a time helped me. Remember that people only show their highlights, not their struggles.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47),
        author: { anonymousName: "Student #284" }
      },
      {
        id: "demo-comment-5",
        content: "You're definitely not alone in feeling this way. I deleted Instagram for a month and it drastically improved my mental health.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 45),
        author: { anonymousName: "Anonymous Student" }
      },
      {
        id: "demo-comment-6",
        content: "Everyone is faking it until they make it. Be kind to yourself.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        author: { anonymousName: "Someone Like Me" }
      }
    ]
  },
  {
    id: "demo-post-4",
    content: "Moved away from home for the first time. The homesickness is hitting much harder than I expected. Does it get easier?",
    tag: "Mental Health",
    identity: "ANONYMOUS",
    authorId: "mock-user-4",
    hearts: 112,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    author: { anonymousName: "Anonymous" },
    likes: [],
    _count: { comments: 1 },
    comments: [
      {
        id: "demo-comment-7",
        content: "It absolutely gets easier. Try joining one club just to meet a few familiar faces during the week.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        author: { anonymousName: "Student #912" }
      }
    ]
  },

  // ─── ALUMNI SUCCESS STORIES ───
  {
    id: "demo-post-5",
    content: "[Demo Story] Former Student — Now Building a Startup\n\nDuring college I constantly felt that everyone else was ahead of me. I struggled with deadlines and confidence, often feeling intense burnout during project submissions. Learning to break large goals into smaller steps and talking to a counselor helped me regain control. \n\nToday I'm building my own startup in the EdTech space. Your grades do not define your entire future. Please give yourself some grace.",
    tag: "Success Stories",
    identity: "ANONYMOUS",
    authorId: "mock-user-5",
    hearts: 342,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    author: { anonymousName: "TCET Alumni" },
    likes: [],
    _count: { comments: 2 },
    comments: [
      {
        id: "demo-comment-8",
        content: "I really needed to read this today. Thank you.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70),
        author: { anonymousName: "Student #33" }
      },
      {
        id: "demo-comment-9",
        content: "So inspiring! It's hard to see the big picture when you're drowning in assignments.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 65),
        author: { anonymousName: "Anonymous Student" }
      }
    ]
  },
  {
    id: "demo-post-6",
    content: "[Demo Story] Alumni — Software Engineer at Microsoft\n\nI failed my core algorithms module in my second year. I thought my career was over before it even started. I took a deep breath, retook the module over the summer, and focused heavily on practical projects rather than just theoretical exams. \n\nIt was a tough road, but I learned resilience. I just celebrated my 2-year anniversary working at Microsoft. Failure is just data—use it to pivot.",
    tag: "Success Stories",
    identity: "ANONYMOUS",
    authorId: "mock-user-6",
    hearts: 512,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    author: { anonymousName: "TCET Alumni (2022)" },
    likes: [],
    _count: { comments: 0 },
    comments: []
  },

  // ─── MEMES / LIGHT HUMOUR ───
  {
    id: "demo-post-7",
    content: "When you planned to study for 6 hours but spent 5 hours organizing your notes, choosing the right lofi playlist, and colour-coding your highlighters. 🤡",
    tag: "Memes",
    identity: "ANONYMOUS",
    authorId: "mock-user-7",
    hearts: 289,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    author: { anonymousName: "Student #777" },
    likes: [],
    _count: { comments: 1 },
    comments: [
      {
        id: "demo-comment-10",
        content: "I feel personally attacked by this post.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9),
        author: { anonymousName: "Anonymous" }
      }
    ]
  },
  {
    id: "demo-post-8",
    content: "Exam tomorrow.\nBrain: let's remember every embarrassing thing you said in high school since 2018 instead of the formula sheet.",
    tag: "Memes",
    identity: "ANONYMOUS",
    authorId: "mock-user-8",
    hearts: 415,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
    author: { anonymousName: "Someone Like Me" },
    likes: [],
    _count: { comments: 2 },
    comments: [
      {
        id: "demo-comment-11",
        content: "Why is this so accurate 😭",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13),
        author: { anonymousName: "Student #101" }
      },
      {
        id: "demo-comment-12",
        content: "Melatonin is my only friend right now.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
        author: { anonymousName: "Anonymous Student" }
      }
    ]
  },
];

export async function getCommunityPosts(firebaseUid: string, tag?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) throw new Error("User not found in database. Falling back to demo data.");

    // Get blocked users to exclude their posts
    const blockedByMe = await prisma.block.findMany({
      where: { blockerId: user.id },
      select: { blockedId: true },
    });
    const blockedIds = blockedByMe.map((b: { blockedId: string }) => b.blockedId);

    const whereClause: any = {
      authorId: { notIn: blockedIds },
    };
    if (tag && tag !== "Latest") {
      whereClause.tag = tag;
    }

    const posts = await prisma.communityPost.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { comments: true },
        },
        likes: {
          where: { userId: user.id },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          take: 50,
          include: {
            author: {
              select: { anonymousName: true },
            }
          }
        },
        author: {
          select: { anonymousName: true },
        }
      },
    });

    // Phase 3 Demo Fallback
    // If the database has no posts (or none matching the filter), return the relevant mock data
    if (posts.length === 0) {
      const filteredDemoData = (tag && tag !== "Latest")
        ? communityDemoData.filter(p => p.tag === tag)
        : communityDemoData;
      
      // Mark whether the current user liked any of these demo posts (just stubbed to false for demo)
      const mappedDemoData = filteredDemoData.map(p => ({
        ...p,
        likes: [], // In a real scenario, we'd check if the user liked it in state
      }));

      return { success: true, posts: mappedDemoData };
    }

    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching community posts, falling back to demo data:", error);
    const filteredDemoData = (tag && tag !== "Latest")
      ? communityDemoData.filter(p => p.tag === tag)
      : communityDemoData;
    
    const mappedDemoData = filteredDemoData.map(p => ({
      ...p,
      likes: [], 
    }));

    return { success: true, posts: mappedDemoData };
  }
}

export async function createCommunityPost(
  firebaseUid: string,
  content: string,
  tag: string,
  identity: PostIdentity = "ANONYMOUS"
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const post = await prisma.communityPost.create({
      data: {
        content,
        tag: tag === "Latest" ? null : tag,
        identity,
        authorId: user.id,
      },
    });
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function toggleLikePost(firebaseUid: string, postId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Prevent crashing if a user tries to "like" a demo post that doesn't exist in the DB
    if (postId.startsWith("demo-post-")) {
      return { success: true, liked: true }; 
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({ where: { id: existingLike.id } });
      await prisma.communityPost.update({
        where: { id: postId },
        data: { hearts: { decrement: 1 } },
      });
      return { success: true, liked: false };
    } else {
      await prisma.postLike.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      await prisma.communityPost.update({
        where: { id: postId },
        data: { hearts: { increment: 1 } },
      });
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function addComment(firebaseUid: string, postId: string, content: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    if (postId.startsWith("demo-post-")) {
      return { success: true, comment: { id: "mock-comment-new", content } };
    }

    const comment = await prisma.communityComment.create({
      data: {
        content,
        authorId: user.id,
        postId,
      },
    });
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function reportItem(
  firebaseUid: string,
  itemId: string,
  itemType: ReportItemType,
  reason: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    if (itemId.startsWith("demo-post-")) {
      return { success: true, report: { id: "mock-report" } };
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedItemId: itemId,
        itemType,
        reason,
      },
    });
    return { success: true, report };
  } catch (error) {
    console.error("Error reporting item:", error);
    return { success: false, error: "Failed to report item" };
  }
}

export async function blockUser(firebaseUid: string, userToBlockId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    if (userToBlockId.startsWith("mock-user-")) {
      return { success: true, block: { id: "mock-block" } };
    }

    const block = await prisma.block.create({
      data: {
        blockerId: user.id,
        blockedId: userToBlockId,
      },
    });
    return { success: true, block };
  } catch (error) {
    console.error("Error blocking user:", error);
    return { success: false, error: "Failed to block user" };
  }
}
