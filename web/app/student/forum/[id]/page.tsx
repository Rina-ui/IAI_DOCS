"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getForumPost, replyToPost, upvoteForumPost, upvoteReply } from "@/lib/forumService";
import type { ForumPostWithReplies, ForumReply } from "@/lib/forumService";
import { ArrowLeft, MessageSquare, Send, ArrowUp, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ForumDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const [post, setPost] = useState<ForumPostWithReplies | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Track which items are being upvoted (with loading states)
  const [upvotingPost, setUpvotingPost] = useState(false);
  const [upvotingReplies, setUpvotingReplies] = useState<Record<string, boolean>>({});

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        console.log("📥 Fetching forum post:", postId);
        const data = await getForumPost(postId);
        console.log("✅ Forum post loaded:", {
          id: data.id,
          title: data.title,
          votes: data.votes,
          repliesCount: data.replies?.length || 0,
        });
        setPost(data);
      } catch (error) {
        console.error("❌ Failed to fetch forum post:", error);
        setErrorMessage("Impossible de charger ce sujet du forum.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !post) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);
      console.log("📝 Submitting reply to post:", post.id);

      const newReply = await replyToPost(post.id, replyContent);

      console.log("✅ Reply submitted:", {
        id: newReply.id,
        author: newReply.author?.firstName,
      });

      // Update post with new reply
      setPost((prev) =>
        prev
          ? {
            ...prev,
            replies: [...prev.replies, newReply],
            answersCount: prev.answersCount + 1,
          }
          : null
      );
      setReplyContent("");
      setSuccessMessage("Votre réponse a été publiée avec succès !");
    } catch (error) {
      console.error("❌ Failed to submit reply:", error);
      setErrorMessage("Impossible de publier votre réponse. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvotePost = async () => {
    if (!post || upvotingPost) return;

    try {
      setUpvotingPost(true);
      console.log("👍 Upvoting post:", post.id);

      const updated = await upvoteForumPost(post.id);

      console.log("✅ Post upvoted:", { newVotes: updated.votes });
      setPost((prev) => (prev ? { ...prev, votes: updated.votes } : null));
    } catch (error) {
      console.error("❌ Failed to upvote post:", error);
      setErrorMessage("Impossible de voter pour ce message.");
    } finally {
      setUpvotingPost(false);
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    if (upvotingReplies[replyId]) return; // Prevent double-click

    try {
      setUpvotingReplies((prev) => ({ ...prev, [replyId]: true }));
      console.log("👍 Upvoting reply:", replyId);

      const updated = await upvoteReply(replyId);

      console.log("✅ Reply upvoted:", { newVotes: updated.votes });
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
      console.error("❌ Failed to upvote reply:", error);
      setErrorMessage("Impossible de voter pour cette réponse.");
    } finally {
      setUpvotingReplies((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  // Auto-focus reply input when user scrolls to it
  const scrollToReply = () => {
    replyInputRef.current?.focus();
    replyInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  if (!post || errorMessage) {
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
        </header>
        <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage || "Sujet non trouvé"}</p>
              <a href="/student/forum" className="text-sm underline mt-2 inline-block">
                Retourner au forum
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
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
        <div className="flex items-center gap-4 text-sm text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {post.author?.firstName?.[0]}
              {post.author?.lastName?.[0]}
            </div>
            <span className="font-bold text-on-surface">
              {post.author?.firstName} {post.author?.lastName}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {new Date(post.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={14} />
            {post.replies.length} réponse{post.replies.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-success/10 border border-success/30 rounded-2xl p-4 text-success flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-error/10 border border-error/20 rounded-2xl p-4 text-error flex items-start gap-3 animate-in fade-in">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Main Post */}
      <article className="bg-surface border-2 border-primary/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={handleUpvotePost}
            disabled={upvotingPost}
            className="flex flex-col items-center gap-1 p-4 rounded-xl bg-neutral hover:bg-primary/10 transition-colors disabled:opacity-50 min-w-[60px]"
          >
            {upvotingPost ? (
              <Loader2 size={20} className="text-primary animate-spin" />
            ) : (
              <ArrowUp size={24} className="text-primary" />
            )}
            <span className="text-2xl font-black text-on-surface">{post.votes}</span>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">
              votes
            </span>
          </button>
          <div className="flex-1">
            <div className="prose prose-sm max-w-none">
              <p className="text-on-surface mb-4 leading-relaxed text-base whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Replies Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Réponses ({post.replies.length})
          </h2>
          {post.replies.length > 0 && (
            <button
              onClick={scrollToReply}
              className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
            >
              <Send size={14} />
              Répondre
            </button>
          )}
        </div>

        {/* Replies List */}
        <div className="space-y-4 mb-8">
          {post.replies.length === 0 ? (
            <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
              <MessageSquare size={48} className="text-secondary/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-on-surface mb-2">
                Aucune réponse pour le moment
              </h3>
              <p className="text-secondary">
                Soyez le premier à répondre à cette question !
              </p>
            </div>
          ) : (
            post.replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-surface border border-secondary/20 rounded-2xl p-6 hover:border-secondary/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleUpvoteReply(reply.id)}
                    disabled={upvotingReplies[reply.id]}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-neutral hover:bg-tertiary/10 transition-colors disabled:opacity-50 min-w-[50px]"
                  >
                    {upvotingReplies[reply.id] ? (
                      <Loader2 size={16} className="text-tertiary animate-spin" />
                    ) : (
                      <ArrowUp size={20} className="text-tertiary" />
                    )}
                    <span className="text-lg font-black text-on-surface">
                      {reply.votes}
                    </span>
                  </button>
                  <div className="flex-1">
                    <p className="text-on-surface mb-3 whitespace-pre-wrap">
                      {reply.content}
                    </p>
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
                        {new Date(reply.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        <div className="bg-surface border-2 border-secondary/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Send size={18} className="text-primary" />
            Votre réponse
          </h3>
          <textarea
            ref={replyInputRef}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrivez votre réponse..."
            rows={6}
            className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-secondary">
              {replyContent.length} caractère{replyContent.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={handleSubmitReply}
              disabled={submitting || !replyContent.trim()}
              className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Répondre
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
