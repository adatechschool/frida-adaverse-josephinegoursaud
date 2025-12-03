"use server";

import { promotionsAda } from "@/db/schema";
import { db } from "@/db/drizzle";

export const GET = async () => {
  try {
    // Sélectionner seulement les promotions
    const promotions = await db
      .select({
        id: promotionsAda.id,
        nom: promotionsAda.nom,
        // date_debut: promotionsAda.date_debut
      })
      .from(promotionsAda)
      .orderBy(promotionsAda.id);

    console.log("Promotions simples:", promotions);
    
    return Response.json(promotions);
  } catch (error) {
    console.error("Erreur fetch promotions:", error);
    return Response.json({ error: "Impossible de récupérer les promotions" }, { status: 500 });
  }
};