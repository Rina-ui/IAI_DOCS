"use client";

import { useState } from "react";
import { Users, Plus, UserPlus } from "lucide-react";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  speciality?: string;
  verified: boolean;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            Gestion des Enseignants
          </h1>
          <p className="text-secondary">
            Créez et gérez les comptes des enseignants.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <UserPlus size={18} />
          Créer un enseignant
        </button>
      </header>

      {teachers.length === 0 ? (
        <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
          <Users size={48} className="text-secondary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">
            Aucun enseignant enregistré
          </h3>
          <p className="text-secondary">
            Commencez par créer le premier compte enseignant.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-surface border border-secondary/20 rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {teacher.firstName[0]}
                  {teacher.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="text-sm text-secondary">{teacher.email}</p>
                  {teacher.speciality && (
                    <p className="text-xs text-secondary mt-1">
                      {teacher.speciality}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                  teacher.verified
                    ? "bg-tertiary/10 text-tertiary"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {teacher.verified ? "Vérifié" : "En attente"}
              </span>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTeacherModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateTeacherModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    speciality: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create teacher
    console.log("Creating teacher:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-secondary/20 rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <UserPlus size={24} className="text-primary" />
            Créer un enseignant
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Spécialité (optionnel)
            </label>
            <input
              type="text"
              value={formData.speciality}
              onChange={(e) =>
                setFormData({ ...formData, speciality: e.target.value })
              }
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
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
