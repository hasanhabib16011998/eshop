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

  // 1. Get or create a shop
  let shop = await prisma.shops.findFirst();
  if (!shop) {
    console.log("No shop found, creating a default seller and shop...");
    // Since seller email is unique, check if the seller already exists or use upsert
    const seller = await prisma.sellers.upsert({
      where: { email: "seller@eshop.com" },
      update: {},
      create: {
        name: "Default Seller",
        email: "seller@eshop.com",
        phone_number: "1234567890",
        country: "US",
      }
    });
    shop = await prisma.shops.create({
      data: {
        name: "E-Shop Outlet",
        bio: "Default e-shop seller store",
        category: "clothing",
        sellerId: seller.id,
      }
    });
    console.log(`Created default shop: ${shop.name} (${shop.id})`);
  } else {
    console.log(`Using existing shop: ${shop.name} (${shop.id})`);
  }

  // 2. Define products list with categories and subcategories as strings
  const productsData = [
    {
      title: "Elegant Floral Summer Dress",
      slug: "elegant-floral-summer-dress",
      categoryName: "Women's Clothing",
      subcategoryName: "Dresses & Jumpsuits",
      short_description: "A lightweight, breathable floral maxi dress perfect for warm summer days.",
      detailed_description: "<p>Embrace sunny days with our <strong>Elegant Floral Summer Dress</strong>. Crafted from premium, ultra-soft chiffon fabric, this dress features a vibrant floral pattern, a flattering V-neckline, and an adjustable wrap-around waist. Whether you are heading to a brunch date or a beachside party, this dress ensures you stay comfortable and stylish throughout the day.</p>",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      brand: "Lumina Fashion",
      colors: ["#FFC0CB", "#FFFFFF", "#ADD8E6"],
      sizes: ["S", "M", "L", "XL"],
      stock: 75,
      sale_price: 49.99,
      regular_price: 79.99,
      tags: ["dress", "floral", "summer", "maxi"],
    },
    {
      title: "Classic Knit Cozy Cardigan",
      slug: "classic-knit-cozy-cardigan",
      categoryName: "Women's Clothing",
      subcategoryName: "Sweaters & Cardigans",
      short_description: "Stay warm in style with this chunky-knit open-front cardigan sweater.",
      detailed_description: "<p>Wrap yourself in pure comfort with our <strong>Classic Knit Cozy Cardigan</strong>. Made from a blend of soft organic cotton and wool, this cardigan features a relaxed, oversized silhouette, ribbed cuffs, and two spacious front pockets. It's the perfect layering piece for cool autumn evenings or chilly winter days.</p>",
      imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
      brand: "Nordic Knit",
      colors: ["#D2B48C", "#808080", "#FFFFFF"],
      sizes: ["M", "L", "XL"],
      stock: 40,
      sale_price: 59.99,
      regular_price: 89.99,
      tags: ["cardigan", "knitwear", "cozy", "sweater"],
    },
    {
      title: "Urban Leather Sneakers",
      slug: "urban-leather-sneakers",
      categoryName: "Footwear",
      subcategoryName: "Sneakers",
      short_description: "Minimalist leather sneakers designed for daily urban exploration.",
      detailed_description: "<p>Step out in confidence with our <strong>Urban Leather Sneakers</strong>. Featuring clean lines, a premium full-grain leather upper, and a durable rubber outsole, these sneakers combine modern style with all-day comfort. The cushioned insole supports your feet, making them perfect for walking tours or casual office wear.</p>",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      brand: "AeroFoot",
      colors: ["#FFFFFF", "#000000"],
      sizes: ["7", "8", "9", "10", "11"],
      stock: 100,
      sale_price: 89.99,
      regular_price: 120.00,
      tags: ["sneakers", "leather", "shoes", "footwear"],
    },
    {
      title: "Starlight Diamond Pendant Necklace",
      slug: "starlight-diamond-pendant-necklace",
      categoryName: "Jewelry & Accessories",
      subcategoryName: "Necklaces & Pendants",
      short_description: "An exquisite sterling silver necklace featuring a sparkling star-shaped diamond pendant.",
      detailed_description: "<p>Add a touch of elegance to any outfit with the <strong>Starlight Diamond Pendant Necklace</strong>. This beautiful piece features a 925 sterling silver chain with a brilliant-cut cubic zirconia diamond nestled in a delicate star design. It makes an ideal gift for anniversaries, birthdays, or special celebrations.</p>",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      brand: "Aura Gems",
      colors: ["#C0C0C0", "#FFD700"],
      sizes: ["One Size"],
      stock: 30,
      sale_price: 129.99,
      regular_price: 199.99,
      tags: ["necklace", "silver", "diamond", "jewelry"],
    },
    {
      title: "Revitalizing Hyaluronic Acid Serum",
      slug: "revitalizing-hyaluronic-acid-serum",
      categoryName: "Beauty & Skincare",
      subcategoryName: "Skincare & Serums",
      short_description: "Hydrate and plump your skin with our fast-absorbing hyaluronic acid serum.",
      detailed_description: "<p>Restore your skin's natural radiance with our <strong>Revitalizing Hyaluronic Acid Serum</strong>. Formulated with pure multi-weight hyaluronic acid and soothing vitamin B5, this serum deeply hydrates, reduces the appearance of fine lines, and promotes a smooth, plump complexion. Perfect for all skin types.</p>",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      brand: "Glow & Co",
      colors: [],
      sizes: ["50ml"],
      stock: 150,
      sale_price: 24.99,
      regular_price: 35.00,
      tags: ["serum", "skincare", "hyaluronic", "beauty"],
    },
    {
      title: "Sleek Suede Crossbody Bag",
      slug: "sleek-suede-crossbody-bag",
      categoryName: "Handbags & Bags",
      subcategoryName: "Shoulder & Crossbody Bags",
      short_description: "A compact crossbody bag crafted from luxury suede with a gold-tone chain.",
      detailed_description: "<p>Elevate your accessory collection with the <strong>Sleek Suede Crossbody Bag</strong>. Combining functionality with chic aesthetics, this bag features a premium faux-suede finish, a secure magnetic flap closure, and a spacious main compartment. The adjustable gold-tone chain strap allows you to wear it as a shoulder bag or crossbody.</p>",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      brand: "Vera Chic",
      colors: ["#8B0000", "#000000", "#808080"],
      sizes: ["Medium"],
      stock: 50,
      sale_price: 45.00,
      regular_price: 65.00,
      tags: ["bag", "crossbody", "suede", "handbag"],
    }
  ];

  console.log("Seeding products...");

  for (const prod of productsData) {
    // Find category ID
    const cat = await prisma.category.findUnique({
      where: { name: prod.categoryName }
    });
    if (!cat) {
      console.warn(`Category not found: ${prod.categoryName}, skipping product ${prod.title}`);
      continue;
    }

    // Find subcategory ID
    const subcat = await prisma.subcategory.findUnique({
      where: {
        name_categoryId: {
          name: prod.subcategoryName,
          categoryId: cat.id
        }
      }
    });
    if (!subcat) {
      console.warn(`Subcategory not found: ${prod.subcategoryName} in Category ${prod.categoryName}, skipping product ${prod.title}`);
      continue;
    }

    // Create or update the product
    const product = await prisma.products.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        category: cat.id,
        subcategory: subcat.id,
        short_description: prod.short_description,
        detailed_description: prod.detailed_description,
        brand: prod.brand,
        colors: prod.colors,
        sizes: prod.sizes,
        stock: prod.stock,
        sale_price: prod.sale_price,
        regular_price: prod.regular_price,
        tags: prod.tags,
        shopId: shop.id,
      },
      create: {
        title: prod.title,
        slug: prod.slug,
        category: cat.id,
        subcategory: subcat.id,
        short_description: prod.short_description,
        detailed_description: prod.detailed_description,
        brand: prod.brand,
        colors: prod.colors,
        sizes: prod.sizes,
        stock: prod.stock,
        sale_price: prod.sale_price,
        regular_price: prod.regular_price,
        tags: prod.tags,
        shopId: shop.id,
        custom_properties: {},
        custom_specifications: [],
        images: {
          create: [
            {
              file_id: `seed-${prod.slug}`,
              url: prod.imageUrl,
            }
          ]
        }
      }
    });

    console.log(`Upserted product: ${product.title}`);
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
