import { projetsAda } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export const GET = async () => {
  const [promo] = await db
    .select()
    .from(projetsAda)
    .where(eq(projetsAda.id, 3));

  return Response.json(promo);
};
