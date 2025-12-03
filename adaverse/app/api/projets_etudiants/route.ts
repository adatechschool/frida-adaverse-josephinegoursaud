import { projetsEtudiants } from "@/db/schema";
import { db } from "@/db/drizzle";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";


// --- GET TOUS LES PROJETS ---
export async function GET() {
  try {
    const data = await db
      .select()
      .from(projetsEtudiants);

    return Response.json(data);
  } catch (error) {
    console.error("❌ Erreur fetch tous les projets:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}


   // --- POST ---
export async function POST(req: NextRequest) {
  console.log("========== DÉBUT POST ==========");
  
  try {
    const body = await req.json();
    console.log("📥 Body reçu:", body);
    console.log("📥 Type de promotionId:", typeof body.promotionId, body.promotionId);
    console.log("📥 Type de projetAdaId:", typeof body.projetAdaId, body.projetAdaId);

    // Validation des champs requis
    if (!body.titre || !body.slug || !body.lienGithub || !body.promotionId || !body.projetAdaId) {
      return Response.json(
        { 
          error: "Champs requis manquants", 
          required: ["titre", "slug", "lienGithub", "promotionId", "projetAdaId"]
        },
        { status: 400 }
      );
    }

    const values: any = {
      titre: body.titre,
      slug: body.slug,
      lienGithub: body.lienGithub,
      promotionId: body.promotionId,
      projetAdaId: body.projetAdaId,
    };

    if (body.illustration) values.illustration = body.illustration;
    if (body.lienDemo) values.lienDemo = body.lienDemo;
    if (body.datePublication) values.datePublication = body.datePublication;

    console.log("📤 Values à insérer:", values);

    const [newProjet] = await db
      .insert(projetsEtudiants)
      .values(values)
      .returning();

    console.log("✅ Projet créé:", newProjet);

    return Response.json(
      { 
        success: true, 
        message: "Projet étudiant créé avec succès",
        data: newProjet 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("========== ERREUR COMPLÈTE ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Code:", error.code);
    console.error("Détails:", error);

    if (error.code === "23505") {
      return Response.json(
        { error: "Ce slug existe déjà" },
        { status: 409 }
      );
    }

    if (error.code === "23503") {
      return Response.json(
        { error: "promotionId ou projetAdaId invalide" },
        { status: 400 }
      );
    }

    return Response.json(
      { 
        error: "Erreur serveur lors de la création du projet",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// --- DELETE projet par ID ---
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      return Response.json(
        { error: "ID du projet manquant ou invalide" },
        { status: 400 }
      );
    }

    await db
      .delete(projetsEtudiants)
      .where(eq(projetsEtudiants.id, id));

    return Response.json(
      { success: true, message: "Projet supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur suppression projet:", error);
    return Response.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}