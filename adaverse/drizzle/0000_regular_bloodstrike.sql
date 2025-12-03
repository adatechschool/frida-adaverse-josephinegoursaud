CREATE TABLE "projets_ada" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom_projet" varchar(100) NOT NULL,
	CONSTRAINT "projets_ada_nom_projet_unique" UNIQUE("nom_projet")
);
--> statement-breakpoint
CREATE TABLE "projets_etudiants" (
	"id" serial PRIMARY KEY NOT NULL,
	"titre" varchar(200) NOT NULL,
	-- "illustration" text,
	"slug" varchar(150) NOT NULL,
	"lien_github" text NOT NULL,
	"lien_demo" text,
	"date_creation" date DEFAULT now() NOT NULL,
	"date_publication" date,
	"promotion_id" integer NOT NULL,
	"projet_ada_id" integer NOT NULL,
	CONSTRAINT "projets_etudiants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promotions_ada" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL,
	"date_debut" date NOT NULL,
	CONSTRAINT "promotions_ada_nom_unique" UNIQUE("nom")
);
--> statement-breakpoint
ALTER TABLE "projets_etudiants" ADD CONSTRAINT "projets_etudiants_promotion_id_promotions_ada_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions_ada"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projets_etudiants" ADD CONSTRAINT "projets_etudiants_projet_ada_id_projets_ada_id_fk" FOREIGN KEY ("projet_ada_id") REFERENCES "public"."projets_ada"("id") ON DELETE cascade ON UPDATE no action;