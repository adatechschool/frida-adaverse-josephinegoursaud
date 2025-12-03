"use client";

import { useState, useEffect } from "react";
import Projectmodal from "./components/Projectmodal";
import ProjectCards from "./components/ProjectCards";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [promotions, setPromotions] = useState<Array<{id: number; nom: string}>>([]);
  const [projects, setProjects] = useState<Array<{id: number; titre: string}>>([]);
  const [studentProjects, setStudentProjects] = useState<Array<{id: number; projetAdaId: number; promotionId: number; [key: string]: any}>>([]);

  //Fetch promotions 
    async function fetchData() {
      try {
        const res = await fetch("/api/promotions");
        const result = await res.json();
        setPromotions(result);
      } catch (error) {
        console.error("Erreur fetch promotions:", error);
      }
    }

  // Fetch projets ADA 
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projets_ada");
        const result = await res.json();
        setProjects(result);
      } catch (error) {
        console.error("Erreur fetch projets:", error);
      }
    }

  const fetchStudentProjects = async () => {
    try {
      const res = await fetch("/api/projets_etudiants");
      const result = await res.json();
      setStudentProjects(result);
    } catch (error) {
      console.error("Erreur fetch projets étudiants:", error);
    }
  };

  // Fetch projets étudiants 
  useEffect(() => {
    fetchData();
    fetchProjects();
    fetchStudentProjects();
  }, []);

  // Supprimer un projet 
  async function deleteProject(id: number) {
    const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!confirmed) return;

    try {
      await fetch(`/api/projets_etudiants?id=${id}`, {
        method: "DELETE",
      });
      fetchStudentProjects(); // rafraîchir la liste
    } catch (error) {
      console.error("Erreur suppression projet:", error);
    }
  }

  //  Grouper les projets par projetAdaId
  const groupedProjects = studentProjects.reduce((acc, project) => {
    const projetAdaId = project.projetAdaId;
    if (!acc[projetAdaId]) acc[projetAdaId] = [];
    acc[projetAdaId].push(project);
    return acc;
  }, {} as Record<number, typeof studentProjects>);

  return (
    <main className="min-h-screen bg-[#121212] text-white p-10 relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-pink-300">ADA</span>VERSE
        </h1>

        <div className="flex items-center gap-4">
          <select className="bg-[#1f1f1f] border border-gray-600 rounded px-4 py-2 text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="all">Tous les projets</option>
            {Array.isArray(promotions) && promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>{promo.nom}</option>
            ))}
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#ff4820] hover:bg-[#e03e18] transition-colors text-white text-sm font-semibold rounded px-5 py-2"
          >
            Soumettre un projet
          </button>
        </div>
      </header>

    {/* Projets groupés */}
      {Object.entries(groupedProjects).map(([projetAdaId, projectsList]) => {
        const projetAda = Array.isArray(projects) 
          ? projects.find(p => p.id === Number(projetAdaId))
          : null;
        console.log("projetAda:", projetAda);
        
 let projetName = "Projets"; // Valeur par défaut

if (projetAdaId === "1") projetName = "AdaQuizz";
if (projetAdaId === "2") projetName = "AdaDataviz";
if (projetAdaId === "3") projetName = "AdaOpte";
if (projetAdaId === "4") projetName = "Adaction";
if (projetAdaId === "5") projetName = "AdaCheck Events";
if (projetAdaId === "6") projetName = "AdaOpte"; 


        return (
          <section key={projetAdaId} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              {projetName} <span className="text-gray-400 text-lg">({projectsList.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsList.map((project) => {
                const promo = Array.isArray(promotions)
                  ? promotions.find(p => p.id === project.promotionId)
                  : null;
                return (
                  <ProjectCards 
                    key={project.id} 
                    project={project} 
                    promotionName={promo ? promo.nom : "Promo inconnue"} 
                    onDelete={deleteProject} 
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Message si aucun projet */}
      {studentProjects.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">Aucun projet pour le moment</p>
        </div>
      )}

      {/* Modal */}
      <Projectmodal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        onProjectCreated={fetchStudentProjects}
      />
    </main>
  );
}
