"use client";

import { useState } from "react";

export default function ProjectCards({ 
  project, 
  promotionName,
  onDelete
}: { 
  project: any; 
  promotionName: string;
  onDelete: (id: number) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const formatPromotionName = (name: string) => {
    if (!name) return "Promotion";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const publicationDate = project.datePublication || "inconnue";

  return (
    <>
      {/* --- CARTE --- */}
      <div className="bg-[#1c1c1c] border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
        <h3 className="text-xl font-bold mb-2 text-pink-300">{project.titre}</h3>
        <p className="text-gray-400 text-sm mb-4">Promotion : {promotionName}</p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="px-4 py-2 bg-[#ff4820] hover:bg-[#e03e18] rounded text-sm font-semibold"
          >
            Voir plus
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* --- MODAL DÉTAILS --- */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-[fadeIn_.2s_ease] overflow-hidden">

            {/* --- HEADER --- */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-black">{project.titre}</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-2xl text-gray-400 hover:text-black transition"
              >
                ✕
              </button>
            </div>

            {/* --- CONTENU --- */}
            <div className="p-8 space-y-8">

              {/* Ligne date + projet */}
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <span>📅 Le {publicationDate}</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">🧩 {project.projetAdaNom || "Projet ADA"}</span>
              </div>

              {/* Capsule Promotion */}
              <div>
                <span className="inline-block bg-gray-100 border border-gray-300 text-black px-6 py-2 rounded-full text-lg font-bold">
                  {formatPromotionName(promotionName)}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-4">

                {project.lienDemo && (
                  <a
                    href={project.lienDemo}
                    target="_blank"
                    className="flex-1 bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
                  >
                    🚀 Voir la démo
                  </a>
                )}

                {project.lienGithub && (
                  <a
                    href={project.lienGithub}
                    target="_blank"
                    className="flex-1 border-2 border-black text-black text-center py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
                  >
                    💻 Voir le code
                  </a>
                )}
              </div>

              {/* Bouton supprimer dans le modal */}
              <button
                onClick={() => {
                  onDelete(project.id);
                  setShowDetails(false);
                }}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                Supprimer ce projet
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
