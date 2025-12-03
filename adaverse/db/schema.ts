import { pgTable, serial, text, integer, varchar, date} from 'drizzle-orm/pg-core';

export const projetsAda = pgTable("projets_ada", {
  id: serial("id").primaryKey(),
  nomProjet: varchar("nom_projet", { length: 100 }).notNull().unique()

});


export const promotionsAda = pgTable("promotions_ada", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull().unique(),
  dateDebut: date("date_debut").notNull()
});

export const projetsEtudiants = pgTable("projets_etudiants", {
  id: serial("id").primaryKey(),

  titre: varchar("titre", { length: 200 }).notNull(),
  // illustration: text("illustration"),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  lienGithub: text("lien_github").notNull(),
  lienDemo: text("lien_demo"),

  dateCreation: date("date_creation").notNull().defaultNow(), // DEFAULT CURRENT_DATE
  datePublication: date("date_publication"),

  promotionId: integer("promotion_id")
    .notNull()
    .references(() => promotionsAda.id, { onDelete: "cascade" }),

  projetAdaId: integer("projet_ada_id")
    .notNull()
    .references(() => projetsAda.id, { onDelete: "cascade" })
});