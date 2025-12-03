"use client";

import { useState } from "react";

interface ProjectmodalProps {
  open: boolean; // ✅ Changé de 'any' à 'boolean'
  onClose: () => void;
  onProjectCreated?: () => void;
}

interface FormData {
  title: string;
  github: string;
  demo: string;
  promo: string;
  projet: string;
}

// 🔥 MAPPING DES NOMS VERS LES IDS DE LA BDD
const PROMO_MAP: Record<string, number> = {
  "Frida": 1,
  "Grace": 2,
  "Fatoumata": 3,
  "Frances": 4,
};

const PROJET_MAP: Record<string, number> = {
  "Quizz": 1,
  "Adaopte": 2,
  "Dataviz": 3,
  "Adaction": 4,
  "AdaCheckEvent": 5,
};

// Fonction de validation d'URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function Projectmodal({ open, onClose, onProjectCreated }: ProjectmodalProps) {
  const [form, setForm] = useState<FormData>({
    title: "",
    github: "",
    demo: "",
    promo: "Frida",
    projet: "Quizz",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ État de chargement
  const [error, setError] = useState<string | null>(null); // ✅ État d'erreur

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Efface les erreurs quand l'utilisateur modifie
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // ✅ Validation des URLs
    if (!isValidUrl(form.github)) {
      setError("L'URL GitHub n'est pas valide");
      setIsSubmitting(false);
      return;
    }

    if (form.demo && !isValidUrl(form.demo)) {
      setError("L'URL de démo n'est pas valide");
      setIsSubmitting(false);
      return;
    }

    // ✅ Vérification des mappings
    const promotionId = PROMO_MAP[form.promo];
    const projetAdaId = PROJET_MAP[form.projet];
    
    if (!promotionId || !projetAdaId) {
      setError("Erreur de sélection de promo/projet");
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ Génère un slug unique avec timestamp
      const baseSlug = form.title.toLowerCase().replace(/\s+/g, "-");
      const uniqueSlug = `${baseSlug}-${Date.now()}`;

      const res = await fetch("/api/projets_etudiants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: form.title,
          slug: uniqueSlug,
          lienGithub: form.github,
          lienDemo: form.demo || null,
          promotionId: promotionId,
          projetAdaId: projetAdaId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Erreur POST:", err);
        setError(`Erreur: ${err.error || "Impossible de créer le projet"}`);
        return;
      }

      const data = await res.json();
      console.log("Projet créé avec succès :", data);
      
      // ✅ Rafraîchit la liste des projets
      if (onProjectCreated) {
        await onProjectCreated();
      }
      
      // Ferme le modal et reset le form
      onClose();
      setForm({
        title: "",
        github: "",
        demo: "",
        promo: "Frida",
        projet: "Quizz",
      });
    } catch (error) {
      console.error("Erreur fetch POST:", error);
      setError("❌ Erreur réseau, vérifiez votre connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 left-4 text-2xl text-gray-600 hover:text-black disabled:opacity-50"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Proposer un projet</h2>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Titre */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Titre *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-black rounded-lg p-2 text-black"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* URL GitHub */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">URL GitHub *</label>
            <input
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              className="w-full border border-black rounded-lg p-2 text-black"
              required
              disabled={isSubmitting}
              placeholder="https://github.com/username/repo"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 L'image sera récupérée automatiquement via un fichier <code>thumbnail.png</code>
            </p>
          </div>

          {/* URL démo */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">URL de démo</label>
            <input
              name="demo"
              type="url"
              value={form.demo}
              onChange={handleChange}
              className="w-full border border-black rounded-lg p-2 text-black"
              disabled={isSubmitting}
              placeholder="https://demo.example.com"
            />
          </div>

          {/* Promo ADA */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Promo ADA *</label>
            <select
              name="promo"
              value={form.promo}
              onChange={handleChange}
              className="w-full border border-black rounded-lg p-2 text-black bg-white"
              disabled={isSubmitting}
              required
            >
              <option value="Frida">Frida</option>
              <option value="Grace">Grace</option>
              <option value="Fatoumata">Fatoumata</option>
              <option value="Frances">Frances</option>
            </select>
          </div>

          {/* Projet ADA */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Projet ADA *</label>
            <select
              name="projet"
              value={form.projet}
              onChange={handleChange}
              className="w-full border border-black rounded-lg p-2 text-black bg-white"
              disabled={isSubmitting}
              required
            >
              <option value="Quizz">Quizz</option>
              <option value="Adaopte">Adaopte</option>
              <option value="Dataviz">Dataviz</option>
              <option value="Adaction">Adaction</option>
              <option value="AdaCheckEvent">AdaCheckEvent</option>
            </select>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}