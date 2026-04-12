"use client";

import { useEffect, useState } from "react";
import {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  type Announcement,
  type CreateAnnouncementRequest,
} from "@/lib/announcementService";
import { Megaphone, Plus, Trash2 } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAllAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const handleCreate = async (data: CreateAnnouncementRequest) => {
    try {
      const newAnnouncement = await createAnnouncement(data);
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            Gestion des Annonces
          </h1>
          <p className="text-secondary">
            Publiez et gérez les annonces du système.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Nouvelle annonce
        </button>
      </header>

      {announcements.length === 0 ? (
        <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
          <Megaphone size={48} className="text-secondary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">
            Aucune annonce publiée
          </h3>
          <p className="text-secondary">
            Commencez par créer la première annonce.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-surface border border-secondary/20 rounded-2xl p-6 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-on-surface">
                    {announcement.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      announcement.isActive
                        ? "bg-tertiary/10 text-tertiary"
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {announcement.isActive ? "Active" : "Expirée"}
                  </span>
                </div>
                <p className="text-sm text-secondary mb-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-secondary">
                  Publiée le{" "}
                  {new Date(announcement.createdAt).toLocaleDateString("fr-FR")}
                  {announcement.expiresAt &&
                    ` • Expire le ${new Date(announcement.expiresAt).toLocaleDateString("fr-FR")}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(announcement.id)}
                className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors ml-4"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateAnnouncementModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

function CreateAnnouncementModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: CreateAnnouncementRequest) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      expiresAt: expiresAt || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-secondary/20 rounded-2xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <Megaphone size={24} className="text-primary" />
          Nouvelle annonce
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Contenu
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Date d'expiration (optionnel)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
