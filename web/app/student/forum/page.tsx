"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  Filter,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { getForumPosts, createForumPost, upvoteForumPost } from "@\/lib\/forumService";
import type { ForumPost } from "@\/lib\/types";

// Extract unique tags from posts
const extractTags = (posts: ForumPost[]): string[] => {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).slice(0, 10);
};

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "votes" | "unanswered">("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getForumPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les sujets du forum.");
        console.error("Failed to fetch forum posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleUpvote = async (postId: string) => {
    try {
      const updatedPost = await upvoteForumPost(postId);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, votes: updatedPost.votes } : post))
      );
    } catch (err) {
      console.error("Failed to upvote post:", err);
    }
  };

  const handleCreatePost = async (title: string, content: string) => {
    try {
      setCreating(true);
      const newPost = await createForumPost({ title, content });
      setPosts((prev) => [newPost, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setError("Impossible de créer le sujet. Veuillez réessayer.");
      console.error("Failed to create post:", err);
    } finally {
      setCreating(false);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author?.firstName.toLowerCase().includes(query) ||
        post.author?.lastName.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "unanswered") return a.answersCount - b.answersCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const categories = [
    { name: "Mathématiques", count: 342 },
    { name: "Physique", count: 218 },
    { name: "Éthique IA", count: 156 },
    { name: "Neurosciences", count: 127 },
    { name: "Informatique", count: 489 },
    { name: "Deep Learning", count: 312 },
  ];

  const popularTags = extractTags(posts);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral rounded-2xl" />
          ))}
        </div>
        <div className="h-16 bg-neutral rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            Forum de discussion
          </h1>
          <p className="text-secondary max-w-lg flex items-center gap-2">
            <Sparkles size={16} className="text-primary shrink-0" />
            Explorez et contribuez à la base de connaissances IAI_DOCS.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
        >
          <Plus size={20} strokeWidth={3} />
          Poser une question
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Questions", value: posts.length.toString(), icon: MessageSquare, color: "text-primary" },
          {
            label: "Non répondues",
            value: posts.filter((p) => p.answersCount === 0).toString(),
            icon: HelpCircle,
            color: "text-amber-500",
          },
          {
            label: "Utilisateurs",
            value: [...new Set(posts.map((p) => p.authorId))].length.toString(),
            icon: Users,
            color: "text-tertiary",
          },
          {
            label: "Aujourd'hui",
            value: "+18",
            icon: TrendingUp,
            color: "text-primary",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-5 rounded-2xl border border-secondary/20 flex items-center gap-4 hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center shrink-0">
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-secondary font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <section className="bg-surface border border-secondary/20 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 min-w-0 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary/60" />
          <input
            type="text"
            placeholder="Rechercher une question, un tag ou un auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral border-none rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-secondary/60 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${sortBy === "recent"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Plus récents
          </button>
          <button
            onClick={() => setSortBy("votes")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${sortBy === "votes"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Plus votés
          </button>
          <button
            onClick={() => setSortBy("unanswered")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap hidden sm:block ${sortBy === "unanswered"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Non répondus
          </button>
        </div>
      </section>

      {/* Main Layout: Questions + Right Sidebar */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Question List */}
        <div className="flex-1 min-w-0 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
              <MessageSquare size={48} className="text-secondary/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-on-surface mb-2">Aucun sujet trouvé</h3>
              <p className="text-secondary">
                {searchQuery
                  ? "Essayez de modifier votre recherche."
                  : "Soyez le premier à poser une question !"}
              </p>
            </div>
          ) : (
            filteredPosts.map((q) => (
              <article
                key={q.id}
                className="bg-surface p-6 rounded-2xl border border-secondary/20 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col sm:flex-row gap-6 group"
              >
                {/* Stats Column */}
                <div className="flex sm:flex-col gap-4 sm:gap-3 justify-between sm:justify-start text-center min-w-[80px] shrink-0 pt-1">
                  <button
                    onClick={() => handleUpvote(q.id)}
                    className="flex flex-col items-center hover:bg-neutral/50 p-2 rounded-xl transition-colors"
                  >
                    <span className="text-2xl font-black text-on-surface">{q.votes}</span>
                    <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-0.5">
                      votes
                    </span>
                  </button>
                  <div
                    className={`flex flex-col items-center p-2 rounded-xl border ${q.answersCount > 0
                      ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                      : "text-secondary border-secondary/20"
                      }`}
                  >
                    <span className="text-lg font-bold">{q.answersCount}</span>
                    <span className="text-[9px] uppercase tracking-widest font-black mt-0.5">
                      réponses
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-secondary">
                    <span className="text-sm font-bold">{q.views}</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold mt-0.5">
                      vues
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-grow flex flex-col justify-between min-w-0">
                  <div>
                    <a href={`/student/forum/${q.id}`} className="block">
                      <h2 className="font-headline text-lg lg:text-xl font-bold text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">
                        {q.title}
                      </h2>
                    </a>
                    <p className="text-secondary mb-5 line-clamp-2 leading-relaxed text-sm font-medium">
                      {q.content}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {q.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-neutral border border-secondary/10 px-3 py-1 rounded-lg text-xs font-bold text-on-surface hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {q.author?.firstName?.[0]}
                        {q.author?.lastName?.[0]}
                      </div>
                      <div className="text-xs">
                        <p className="text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                          {q.author?.firstName} {q.author?.lastName}
                        </p>
                        <span className="text-secondary font-medium flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(q.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Right Sidebar — Categories & Tags */}
        <aside className="xl:w-80 shrink-0 space-y-6">
          {/* Categories */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Filter size={14} className="text-primary" />
              Catégories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="#"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:bg-neutral hover:text-on-surface transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/30 group-hover:bg-primary transition-colors" />
                    {cat.name}
                  </span>
                  <span className="text-xs bg-neutral group-hover:bg-surface px-2 py-0.5 rounded-md font-bold">
                    {cat.count}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              Tags populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-neutral border border-secondary/10 px-3 py-1.5 rounded-lg text-xs font-bold text-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Users size={14} className="text-primary" />
              Top contributeurs
            </h3>
            <div className="space-y-3">
              {[
                { name: "Dr. Elena Rostova", score: "2.4k" },
                { name: "Jean-Luc Moreau", score: "1.8k" },
                { name: "Amina Diallo", score: "1.2k" },
              ].map((user) => (
                <div key={user.name} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-secondary font-medium">{user.score} points</p>
                  </div>
                  <ArrowUpRight size={14} className="text-secondary/30 group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
          creating={creating}
        />
      )}
    </div>
  );
}

// Create Post Modal Component
function CreatePostModal({
  onClose,
  onSubmit,
  creating,
}: {
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  creating: boolean;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-secondary/20 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Poser une question</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-on-surface mb-2">
              Titre de la question
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comment optimiser un modèle NLP pour des textes médicaux ?"
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold text-on-surface mb-2">
              Description détaillée
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre question en détail..."
              rows={8}
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral text-secondary px-6 py-3 rounded-xl font-bold hover:bg-secondary/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating || !title.trim() || !content.trim()}
              className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Publication..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
