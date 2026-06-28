import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesData = [
  {
    name: "Women's Clothing",
    subCategories: [
      "Dresses & Jumpsuits",
      "Tops & Blouses",
      "Sweaters & Cardigans",
      "Pants & Trousers",
      "Skirts",
      "Activewear & Athleisure",
      "Outerwear & Jackets",
      "Lingerie & Sleepwear"
    ]
  },
  {
    name: "Footwear",
    subCategories: [
      "Heels & Pumps",
      "Flats & Loafers",
      "Sneakers",
      "Boots & Booties",
      "Sandals & Wedges"
    ]
  },
  {
    name: "Handbags & Bags",
    subCategories: [
      "Tote Bags",
      "Shoulder & Crossbody Bags",
      "Clutches & Evening Bags",
      "Backpacks",
      "Wallets & Cardholders"
    ]
  },
  {
    name: "Jewelry & Accessories",
    subCategories: [
      "Necklaces & Pendants",
      "Earrings",
      "Bracelets & Bangles",
      "Rings",
      "Sunglasses",
      "Scarves & Wraps",
      "Hats & Hair Accessories"
    ]
  },
  {
    name: "Beauty & Skincare",
    subCategories: [
      "Skincare & Serums",
      "Makeup & Cosmetics",
      "Haircare & Styling",
      "Fragrances & Perfumes",
      "Body & Bath Care"
    ]
  }
];

async function main() {
  console.log("Seeding categories and subcategories for Women's E-commerce...");

  for (const item of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: item.name },
      update: {},
      create: { name: item.name },
    });

    console.log(`Created category: ${category.name}`);

    for (const subName of item.subCategories) {
      await prisma.subcategory.upsert({
        where: {
          name_categoryId: {
            name: subName,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          name: subName,
          categoryId: category.id,
        },
      });
      console.log(`  └─ Created subcategory: ${subName}`);
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
