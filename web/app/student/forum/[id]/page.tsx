"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getForumPost, replyToPost, upvoteForumPost, upvoteReply } from "@/lib/forumService";
import type { ForumPostWithReplies, ForumReply } from "@/lib/forumService";
import { ArrowLeft, MessageSquare, Send, ArrowUpRight, Clock } from "lucide-react";

export default function ForumDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<ForumPostWithReplies | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getForumPost(postId);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch forum post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !post) return;

    try {
      setSubmitting(true);
      const newReply = await replyToPost(post.id, replyContent);
      setPost((prev) =>
        prev ? { ...prev, replies: [...prev.replies, newReply] } : null
      );
      setReplyContent("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvotePost = async () => {
    if (!post) return;
    try {
      const updated = await upvoteForumPost(post.id);
      setPost((prev) => (prev ? { ...prev, votes: updated.votes } : null));
    } catch (error) {
      console.error("Failed to upvote post:", error);
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    try {
      const updated = await upvoteReply(replyId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              replies: prev.replies.map((r) =>
                r.id === replyId ? { ...r, votes: updated.votes } : r
              ),
            }
          : null
      );
    } catch (error) {
      console.error("Failed to upvote reply:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="h-40 bg-neutral rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">Sujet non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <a
          href="/student/forum"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au forum
        </a>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          {post.title}
        </h1>
      </header>

      {/* Main Post */}
      <article className="bg-surface border border-secondary/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={handleUpvotePost}
            className="flex flex-col items-center p-3 rounded-xl bg-neutral hover:bg-neutral/80 transition-colors"
          >
            <span className="text-2xl font-black text-on-surface">{post.votes}</span>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">
              votes
            </span>
          </button>
          <div className="flex-1">
            <p className="text-on-surface mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {post.author?.firstName?.[0]}
                {post.author?.lastName?.[0]}
              </div>
              <span className="font-bold text-on-surface">
                {post.author?.firstName} {post.author?.lastName}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Replies */}
      <section>
        <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          {post.replies.length} Réponse{post.replies.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-4 mb-8">
          {post.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-surface border border-secondary/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleUpvoteReply(reply.id)}
                  className="flex flex-col items-center p-3 rounded-xl bg-neutral hover:bg-neutral/80 transition-colors"
                >
                  <span className="text-xl font-black text-on-surface">
                    {reply.votes}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">
                    votes
                  </span>
                </button>
                <div className="flex-1">
                  <p className="text-on-surface mb-3">{reply.content}</p>
                  <div className="flex items-center gap-3 text-sm text-secondary">
                    <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary font-bold text-xs">
                      {reply.author?.firstName?.[0]}
                      {reply.author?.lastName?.[0]}
                    </div>
                    <span className="font-bold text-on-surface">
                      {reply.author?.firstName} {reply.author?.lastName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(reply.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-on-surface mb-4">
            Votre réponse
          </h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrivez votre réponse..."
            rows={5}
            className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
          />
          <button
            onClick={handleSubmitReply}
            disabled={submitting || !replyContent.trim()}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 ml-auto shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Send size={16} />
            {submitting ? "Envoi..." : "Répondre"}
          </button>
        </div>
      </section>
    </div>
  );
}
