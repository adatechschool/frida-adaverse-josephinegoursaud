import { projetsEtudiants } from "@/db/schema";
import { db } from "@/db/drizzle";

// GET tous les projets
export async function GET() {
  try {
    const data = await db
      .select()
      .from(projetsEtudiants);

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Erreur fetch projets:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des projets" }), 
      { status: 500 }
    );
  }
}


