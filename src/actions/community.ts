"use server";

import { prisma } from "@/lib/prisma";
import { PostIdentity, ReportItemType } from "@/generated/prisma/client";

export async function getCommunityPosts(firebaseUid: string, tag?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

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

    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return { success: false, error: "Failed to fetch posts" };
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
        data: { userId: user.id, postId },
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

    const comment = await prisma.communityComment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
      include: {
        author: { select: { anonymousName: true } }
      }
    });
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function reportItem(
  firebaseUid: string,
  reportedItemId: string,
  itemType: ReportItemType,
  reason: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const report = await prisma.report.create({
      data: {
        reportedItemId,
        itemType,
        reason,
        reporterId: user.id,
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

    await prisma.block.create({
      data: {
        blockerId: user.id,
        blockedId: userToBlockId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error blocking user:", error);
    return { success: false, error: "Failed to block user" };
  }
}
