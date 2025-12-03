import { promotionsAda } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

// --- GET ---
export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  const data = await db
    .select()
    .from(promotionsAda)
    .where(eq(promotionsAda.id, Number(id)));

  return Response.json(data);
};
