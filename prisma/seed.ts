import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const IMG = {
  indigo: ["/images/products/poutou-indigo.svg", "/images/products/poutou-sable.svg"],
  terracotta: ["/images/products/poutou-terracotta.svg", "/images/products/poutou-indigo.svg"],
  foret: ["/images/products/poutou-foret.svg", "/images/products/poutou-sable.svg"],
  sable: ["/images/products/poutou-sable.svg", "/images/products/poutou-terracotta.svg"],
};

const categories = [
  { name: "Grande taille", slug: "grande-taille" },
  { name: "Petite taille", slug: "petite-taille" },
  { name: "Multiples couleurs", slug: "multiples-couleurs" },
];

const products = [
  {
    name: "Poutou de Labé — Indigo Royal",
    slug: "poutou-labe-indigo-royal",
    description:
      "Tissé et teint à la main par les maîtres teinturiers de Labé, ce poutou plonge trois fois dans la cuve d'indigo pour obtenir ce bleu profond caractéristique du Fouta-Djallon. La calotte souple épouse la tête et le liseré est cousu au fil de coton ciré. Une pièce de cérémonie qui se porte aussi au quotidien.",
    price: 350000,
    stock: 12,
    sizes: ["56", "57", "58"],
    color: "Indigo profond",
    region: "Labé",
    category: "grande-taille",
    images: IMG.indigo,
  },
  {
    name: "Poutou Classique de Pita",
    slug: "poutou-classique-pita",
    description:
      "Le modèle de tous les jours : coton épais double couche, motif damier blanc cassé et noir tissé dans la masse. Léger, respirant, il garde sa forme même plié dans un sac. C'est le poutou que portent les anciens de Pita au marché du samedi.",
    price: 180000,
    stock: 25,
    sizes: ["58", "59", "60"],
    color: "Blanc cassé & noir",
    region: "Pita",
    category: "multiples-couleurs",
    images: IMG.sable,
  },
  {
    name: "Poutou Brodé « Étoile du Fouta »",
    slug: "poutou-brode-etoile-du-fouta",
    description:
      "Huit jours de broderie au fil de soie pour dessiner l'étoile à huit branches, symbole de guidance chez les Peuls du Fouta. Fond bordeaux, motifs dorés, doublure en coton doux. Chaque pièce est signée à l'intérieur par la brodeuse de Timbi Madina qui l'a réalisée.",
    price: 420000,
    stock: 6,
    sizes: ["56", "57", "58"],
    color: "Bordeaux, motifs dorés",
    region: "Timbi Madina",
    category: "multiples-couleurs",
    images: IMG.terracotta,
  },
  {
    name: "Poutou de Dalaba — Vert Forêt",
    slug: "poutou-dalaba-vert-foret",
    description:
      "Inspiré des collines brumeuses de Dalaba, ce poutou en laine fine locale tient chaud pendant l'harmattan. Le vert forêt est obtenu par teinture végétale à base de feuilles d'indigotier mélangées au cola. Finition sobre, sans broderie.",
    price: 200000,
    stock: 15,
    sizes: ["54", "55", "56"],
    color: "Vert forêt",
    region: "Dalaba",
    category: "petite-taille",
    images: IMG.foret,
  },
  {
    name: "Poutou « Teddungal » (Honneur)",
    slug: "poutou-teddungal-honneur",
    description:
      "« Teddungal » signifie honneur en pulaar. Réservé aux grandes occasions — baptêmes, mariages, fêtes de Tabaski — ce poutou blanc éclatant est entièrement recouvert d'une broderie dense en relief. Livré dans sa boîte en carton rigide avec un carré de tissu de protection.",
    price: 480000,
    stock: 4,
    sizes: ["58", "59", "60"],
    color: "Blanc éclatant",
    region: "Labé",
    category: "grande-taille",
    images: IMG.sable,
  },
  {
    name: "Poutou de Mamou Ocre",
    slug: "poutou-mamou-ocre",
    description:
      "Les tons ocre et brun de ce modèle rappellent la latérite des pistes de Mamou. Tissage serré en coton filé main, bande de tête renforcée. Un classique robuste, pensé pour durer des années.",
    price: 165000,
    stock: 20,
    sizes: ["56", "57", "58"],
    color: "Ocre & brun",
    region: "Mamou",
    category: "multiples-couleurs",
    images: IMG.terracotta,
  },
  {
    name: "Poutou Brodé « Lasso Doré »",
    slug: "poutou-brode-lasso-dore",
    description:
      "Sur fond noir profond, un entrelacs doré court tout autour de la calotte — le « lasso », motif de protection transmis de mère en fille. Broderie au fil métallisé résistant au lavage à la main. Se marie aussi bien avec un boubou qu'avec une tenue de ville.",
    price: 390000,
    stock: 8,
    sizes: ["56", "57", "58"],
    color: "Noir & or",
    region: "Pita",
    category: "multiples-couleurs",
    images: IMG.indigo,
  },
  {
    name: "Poutou du Berger — Édition Simple",
    slug: "poutou-berger-edition-simple",
    description:
      "Le modèle historique, sans fioritures : celui que portent les bergers peuls sur les hauts plateaux de Koundara. Coton écru robuste, coutures apparentes, prix accessible. Parfait comme premier poutou ou comme cadeau.",
    price: 120000,
    stock: 30,
    sizes: ["58", "59", "60"],
    color: "Écru",
    region: "Koundara",
    category: "grande-taille",
    images: IMG.sable,
  },
  {
    name: "Poutou « Néné » Brodé Fleuri",
    slug: "poutou-nene-brode-fleuri",
    description:
      "Un modèle plus doux, taillé petit, orné de fleurs d'indigo brodées sur fond ivoire. « Néné » est le nom affectueux donné aux mères au Fouta. Coton peigné très souple, idéal pour un port prolongé.",
    price: 360000,
    stock: 10,
    sizes: ["54", "55", "56"],
    color: "Ivoire, fleurs indigo",
    region: "Dalaba",
    category: "multiples-couleurs",
    images: IMG.foret,
  },
  {
    name: "Poutou de Fête de Timbi",
    slug: "poutou-fete-timbi",
    description:
      "Bleu nuit rehaussé de fils argentés, ce poutou de fête capte la lumière à chaque mouvement. Tissé à Timbi Madina pour les célébrations de fin de Ramadan, il est doublé de soie pour un confort absolu. Quantités très limitées à chaque saison.",
    price: 450000,
    stock: 5,
    sizes: ["56", "57", "58"],
    color: "Bleu nuit & argent",
    region: "Timbi Madina",
    category: "multiples-couleurs",
    images: IMG.indigo,
  },
];

async function main() {
  console.log("→ Seed des catégories…");
  const catBySlug = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    catBySlug.set(c.slug, cat.id);
  }

  console.log("→ Seed des produits…");
  for (const p of products) {
    const { category, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, categoryId: catBySlug.get(category)! },
      create: { ...data, categoryId: catBySlug.get(category)! },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@poutou.shop";
  console.log(`→ Compte admin (${adminEmail})…`);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: { email: adminEmail, name: "Administrateur", role: "ADMIN" },
  });

  // Optionnel : crée aussi l'utilisateur Supabase Auth si la clé service + un mot de passe sont fournis.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (supabaseUrl && serviceKey && adminPassword) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      if (error) {
        console.log(`  (Supabase Auth : ${error.message} — probablement déjà créé)`);
      } else {
        console.log("  Utilisateur Supabase Auth admin créé.");
      }
    } catch (e) {
      console.log("  (Supabase Auth non joignable — compte auth à créer manuellement)", e);
    }
  } else {
    console.log(
      "  Astuce : inscrivez-vous sur le site avec cet e-mail pour activer l'accès admin,"
    );
    console.log(
      "  ou renseignez ADMIN_PASSWORD + SUPABASE_SERVICE_ROLE_KEY puis relancez le seed."
    );
  }

  console.log("✔ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
