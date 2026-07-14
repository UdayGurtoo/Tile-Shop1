import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (name: string) => `/images/${encodeURIComponent(name)}`;

async function main() {
  console.log("Seeding Mohit Tiles & Granites...");

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.clientLogo.deleteMany();
  await prisma.homepageBlock.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.contactInquiry.deleteMany();
  await prisma.contactDetails.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  const store = await prisma.store.create({
    data: {
      name: "Mohit Tiles & Granites",
      slug: "mohit-tiles-ghaziabad",
    },
  });

  const password = process.env.ADMIN_PASSWORD || "StrongPassword@123";
  const email = (process.env.ADMIN_EMAIL || "admin@mohit.com").toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: process.env.ADMIN_NAME || "Store Admin",
      role: Role.SUPER_ADMIN,
      storeId: store.id,
    },
  });

  const cera = await prisma.brand.create({
    data: {
      storeId: store.id,
      name: "CERA",
      slug: "cera",
      description: "Innovative designs in bathroom solutions.",
      logoUrl: img("L 1.png"),
      sortOrder: 1,
    },
  });

  const somany = await prisma.brand.create({
    data: {
      storeId: store.id,
      name: "SOMANY",
      slug: "somany",
      description: "Inspired by Italian craftsmanship.",
      logoUrl: img("L 4.png"),
      sortOrder: 2,
    },
  });

  await prisma.brand.createMany({
    data: [
      { storeId: store.id, name: "Brand Partner", slug: "partner-2", logoUrl: img("L 2.png"), sortOrder: 3 },
      { storeId: store.id, name: "Brand Partner 3", slug: "partner-3", logoUrl: img("L 3.png"), sortOrder: 4 },
    ],
  });

  const toilets = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Toilets",
      slug: "toilets",
      imageUrl: img("C 21.png"),
      description: "Premium toilet seats & sanitaryware",
      sortOrder: 1,
      seoTitle: "Toilet Seats | Mohit Tiles & Granites",
    },
  });

  const faucets = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Faucets",
      slug: "faucets",
      imageUrl: img("C 22.png"),
      description: "Premium faucets & fittings",
      sortOrder: 2,
      seoTitle: "Premium Faucets | Mohit Tiles & Granites",
    },
  });

  const washBasins = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Wash Basins",
      slug: "wash-basins",
      imageUrl: img("C 23.png"),
      description: "Elegant wash basins",
      sortOrder: 3,
    },
  });

  const bathroomTiles = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Bathroom Tiles",
      slug: "bathroom-tiles",
      imageUrl: img("C 11.png"),
      sortOrder: 4,
    },
  });

  const kitchen = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Kitchen",
      slug: "kitchen",
      imageUrl: img("C 12.png"),
      sortOrder: 5,
      seoTitle: "Kitchen Designs | Mohit Tiles & Marbles",
    },
  });

  const livingRoom = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Living Room",
      slug: "living-room",
      imageUrl: img("C 13.png"),
      sortOrder: 6,
    },
  });

  const granites = await prisma.category.create({
    data: {
      storeId: store.id,
      name: "Granites & Marbles",
      slug: "granites-marbles",
      imageUrl: img("MB.png"),
      sortOrder: 7,
      seoTitle: "Premium Granite Collection | Mohit Tiles",
    },
  });

  // Hero banners
  await prisma.heroBanner.createMany({
    data: [
      {
        storeId: store.id,
        title: "Luxury Kitchen",
        subtitle: "Crafted with style and durability",
        imageUrl: img("SI 1.png"),
        type: "HERO",
        sortOrder: 1,
      },
      {
        storeId: store.id,
        title: "Premium Tiles",
        subtitle: "Elegant designs for modern spaces",
        imageUrl: img("SI 2.png"),
        type: "HERO",
        sortOrder: 2,
      },
      {
        storeId: store.id,
        title: "CERA Exclusive",
        subtitle: "World-class sanitaryware fittings",
        imageUrl: img("SI 3.png"),
        type: "HERO",
        sortOrder: 3,
      },
      {
        storeId: store.id,
        title: "Modern Bathroom",
        subtitle: "Sophisticated solutions for your home",
        imageUrl: img("SI 4.png"),
        type: "HERO",
        sortOrder: 4,
      },
      {
        storeId: store.id,
        title: "UPTO 30% Off on Cera and Somany SanitaryWare",
        subtitle: "Limited period offer",
        imageUrl: img("SI 3.png"),
        type: "PROMO",
        sortOrder: 0,
      },
    ],
  });

  await prisma.offer.create({
    data: {
      storeId: store.id,
      title: "UPTO 30% Off on Cera and Somany SanitaryWare",
      discountText: "UPTO 30% OFF",
      description: "Flat discounts on selected Cera and Somany sanitaryware.",
      isActive: true,
      sortOrder: 1,
    },
  });

  await prisma.contactDetails.create({
    data: {
      storeId: store.id,
      businessName: "Mohit Tiles & Granites",
      addressLine1: "Shalimar Garden",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      country: "India",
      phonePrimary: "+919818697434",
      whatsapp: "919818697434",
      email: "info@mohittiles.com",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Mohit+Tiles+%26+Granites,+Shalimar+Garden,+Ghaziabad&output=embed",
      latitude: 28.6895,
      longitude: 77.3397,
      openTime: "10:00 AM",
      closeTime: "8:00 PM",
      openDays: "Everyday",
      aboutTitle: "OUR 40-YEAR LEGACY",
      legacyText:
        "Founded 40 years ago as a specialist in tiles and granites, Mohit Tiles & Granites has grown into Ghaziabad's premier home destination. With 3 modern showrooms and a catalog featuring over 10 global brands.",
      aboutHtml:
        "<h4>Why Choose Mohit Tiles?</h4><ul style='list-style:disc;padding-left:20px;margin-top:10px;'><li><strong>40+ Years of Experience:</strong> Unmatched market knowledge and trust.</li><li><strong>Multi-Brand Showroom:</strong> Direct dealer for Cera, Somany, Jaquar, Kajaria, and import-grade granites.</li><li><strong>Complete Bathroom Solutions:</strong> From pipes & fittings to luxury sanitaryware and modular vanities.</li></ul>",
    },
  });

  await prisma.homepageBlock.createMany({
    data: [
      {
        storeId: store.id,
        key: "sanitary_heading",
        title: "FIND SANITARYWARE BY CATEGORY",
        sortOrder: 1,
      },
      {
        storeId: store.id,
        key: "tiles_heading",
        title: "FIND TILES BY CATEGORY",
        sortOrder: 2,
      },
      {
        storeId: store.id,
        key: "about",
        title: "OUR 40-YEAR LEGACY",
        body: "Founded 40 years ago as a specialist in tiles and granites, Mohit Tiles & Granites has grown into Ghaziabad's premier home destination.",
        sortOrder: 3,
      },
      {
        storeId: store.id,
        key: "contact_heading",
        title: "VISIT OUR SHOWROOM",
        sortOrder: 4,
      },
      {
        storeId: store.id,
        key: "seo_home",
        title: "Mohit Tiles & Granites | 40 Years of Excellence",
        subtitle:
          "Premium tiles, granites, faucets and sanitaryware in Ghaziabad. Cera, Somany and more.",
        metadata: {
          keywords: "tiles, granite, sanitaryware, faucets, Ghaziabad, Cera, Somany",
        },
        sortOrder: 0,
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { storeId: store.id, key: "logo_url", value: "/images/mtg-logo.svg" },
      { storeId: store.id, key: "splash_title", value: "MOHIT TILES AND GRANITES" },
      { storeId: store.id, key: "default_og_image", value: img("SI 1.png") },
    ],
  });

  await prisma.clientLogo.createMany({
    data: [
      { storeId: store.id, name: "CERA", imageUrl: img("L 1.png"), sortOrder: 1 },
      { storeId: store.id, name: "Partner", imageUrl: img("L 2.png"), sortOrder: 2 },
      { storeId: store.id, name: "Partner 3", imageUrl: img("L 3.png"), sortOrder: 3 },
      { storeId: store.id, name: "SOMANY", imageUrl: img("L 4.png"), sortOrder: 4 },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        storeId: store.id,
        name: "Rajesh Sharma",
        role: "Homeowner",
        content:
          "Excellent quality tiles and very professional staff. Our bathroom renovation looks premium.",
        rating: 5,
        sortOrder: 1,
      },
      {
        storeId: store.id,
        name: "Priya Verma",
        role: "Interior Designer",
        content:
          "Best showroom in Ghaziabad for granite and sanitaryware. Wide range of Cera and Somany products.",
        rating: 5,
        sortOrder: 2,
      },
      {
        storeId: store.id,
        name: "Amit Kumar",
        company: "BuildRight Contractors",
        content: "Reliable stock, competitive pricing, and quick delivery for project orders.",
        rating: 5,
        sortOrder: 3,
      },
    ],
  });

  await prisma.fAQ.createMany({
    data: [
      {
        storeId: store.id,
        question: "Do you provide installation services?",
        answer: "We can recommend trusted local installers and guide you on best practices for tiles and sanitaryware.",
        sortOrder: 1,
      },
      {
        storeId: store.id,
        question: "What are your store timings?",
        answer: "We are open every day from 10:00 AM to 8:00 PM.",
        sortOrder: 2,
      },
      {
        storeId: store.id,
        question: "Can I get bulk pricing for projects?",
        answer: "Yes. Contact us with your project requirements for special contractor and bulk rates.",
        sortOrder: 3,
      },
      {
        storeId: store.id,
        question: "Do prices include GST?",
        answer: "Displayed offer prices are indicative. Final billing includes applicable GST as per invoice.",
        sortOrder: 4,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        storeId: store.id,
        title: "Showroom Consultation",
        description: "Visit our Ghaziabad showrooms for curated product guidance.",
        sortOrder: 1,
      },
      {
        storeId: store.id,
        title: "Project Supply",
        description: "Bulk supply for residential and commercial projects.",
        sortOrder: 2,
      },
      {
        storeId: store.id,
        title: "Brand Authenticity",
        description: "Authorized range from Cera, Somany and other premium brands.",
        sortOrder: 3,
      },
    ],
  });

  // Kitchen gallery
  for (let i = 1; i <= 40; i++) {
    await prisma.galleryImage.create({
      data: {
        storeId: store.id,
        title: `Kitchen Design ${i}`,
        imageUrl: img(`O-${i}.png`),
        category: "kitchen",
        sortOrder: i,
      },
    });
  }

  // Granite products
  const graniteProducts = [
    { name: "COTTON WHITE", count: 4, price: 64 },
    { name: "KOTDA GRANITE", count: 3, price: 66 },
    { name: "P WHITE GRANITE", count: 3, price: 52 },
    { name: "PARADISO GRANITE", count: 3, price: 61 },
    { name: "GALAXY BROWN", count: 2, price: 55 },
    { name: "BLACK PEARL GRANITE", count: 3, price: 64 },
    { name: "PANCHANWARA BROWN GRANITE", count: 2, price: 63 },
    { name: "STAR WHITE", count: 3, price: 58 },
    { name: "PARADISO BROWN", count: 5, price: 59 },
    { name: "GREEN APPLE", count: 3, price: 75 },
  ];

  for (const [idx, g] of graniteProducts.entries()) {
    const slug = g.name.toLowerCase().replace(/\s+/g, "-");
    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: granites.id,
        name: g.name,
        slug,
        mrp: g.price,
        price: g.price,
        unit: "sq ft",
        material: "Granite",
        finish: "Polished",
        stockQuantity: 100,
        isPublished: true,
        isFeatured: idx < 3,
        isNewArrival: idx >= 7,
        shortDescription: `Premium ${g.name} granite. Price starts at ₹${g.price}/sq ft.`,
        description: `High-quality ${g.name} granite suitable for flooring, kitchen platforms and counters.`,
        size: "Custom",
        seoTitle: `${g.name} Granite | Mohit Tiles`,
        seoDescription: `Buy ${g.name} granite from ₹${g.price}/sq ft at Mohit Tiles & Granites, Ghaziabad.`,
        sortOrder: idx + 1,
      },
    });

    for (let i = 1; i <= g.count; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img(`${g.name} ${i}.png`),
          thumbnailUrl: img(`${g.name} ${i}.png`),
          alt: `${g.name} ${i}`,
          sortOrder: i,
        },
      });
    }
  }

  type Faucet = { name: string; code: string; mrp: number };

  async function seedFaucets(
    items: Faucet[],
    brandId: string,
    collection: string,
    imgPrefix: string,
    discount: number,
    featured = false
  ) {
    for (const [index, prod] of items.entries()) {
      const offer = Math.round(prod.mrp * (1 - discount));
      const slug = `${collection}-${prod.code}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await prisma.product.create({
        data: {
          storeId: store.id,
          categoryId: faucets.id,
          brandId,
          name: prod.name,
          slug,
          sku: prod.code,
          collection,
          mrp: prod.mrp,
          price: offer,
          discountPercent: discount * 100,
          material: "Chrome",
          finish: "Chrome",
          color: "Silver",
          unit: "piece",
          stockQuantity: 25,
          isPublished: true,
          isFeatured: featured && index < 2,
          isNewArrival: index === 0,
          shortDescription: `${collection} collection — ${Math.round(discount * 100)}% OFF`,
          seoTitle: `${prod.name} | ${collection}`,
          seoDescription: `${prod.name} (${prod.code}) available at Mohit Tiles & Granites.`,
          sortOrder: index + 1,
        },
      });
      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: img(`${imgPrefix} ${index + 1}.png`),
          thumbnailUrl: img(`${imgPrefix} ${index + 1}.png`),
          alt: prod.name,
          sortOrder: 0,
        },
      });
    }
  }

  await seedFaucets(
    [
      { name: "Optimus Single Lever Basin Mixer", code: "272111450011", mrp: 3450 },
      { name: "Optimus Single Lever High Basin Mixer", code: "272111450021", mrp: 4650 },
      { name: "Optimus Exp. Part For Regular Div.", code: "272151450011", mrp: 1130 },
      { name: "Optimus Pillar Cock", code: "272211450031", mrp: 1090 },
      { name: "Optimus Bib Cock", code: "272211450011", mrp: 1010 },
      { name: "Optimus Long Nose Bib Cock", code: "272211450021", mrp: 1270 },
      { name: "Optimus Bath Tub Spout", code: "272111450041", mrp: 1380 },
      { name: "Optimus Sink Mixer Wall Mounted", code: "272201450011", mrp: 3480 },
      { name: "Optimus Wall Mixer L Bend", code: "272201450041", mrp: 4520 },
      { name: "Optimus Sink Cock With Swinging Spout WM", code: "272211450091", mrp: 1750 },
      { name: "Optimus Sink Cock with Round J Spout", code: "272211450161", mrp: 1750 },
      { name: "Optimus Angular Stop Cock", code: "272211450041", mrp: 720 },
      { name: "Optimus Two Way Angular Stop Cock", code: "272211450061", mrp: 1570 },
    ],
    somany.id,
    "Optimus",
    "SF",
    0.3,
    true
  );

  await seedFaucets(
    [
      { name: "Thistle Single Lever Basin Mixer with Braided Hoses", code: "272111140011", mrp: 5070 },
      { name: "Thistle Single Lever High Basin Mixer with Braided Hoses", code: "272111140021", mrp: 6480 },
      { name: "Thistle Exposed Part Kit of 3 Inlet and Hi Flow Diverter", code: "272111140121", mrp: 2480 },
      { name: "Thistle Pillar Tap", code: "272211140011", mrp: 2260 },
      { name: "Thistle Wall Mixer with Bend", code: "272201140011", mrp: 7570 },
      { name: "Thistle Long Nose Bib Tap", code: "272211140031", mrp: 2260 },
      { name: "Thistle Bath Spout with Wall Flange", code: "272211140141", mrp: 1830 },
      { name: "Thistle Sink Mixer Wall Mounted", code: "272201140061", mrp: 5400 },
      { name: "Thistle Sink Cock with Extended Spout", code: "272211140191", mrp: 3230 },
      { name: "Thistle Angle Valve", code: "272211140041", mrp: 1360 },
    ],
    somany.id,
    "Thistle",
    "SFT",
    0.3
  );

  await seedFaucets(
    [
      { name: "Stylo Single Lever Basin Mixer", code: "272201520031", mrp: 2720 },
      { name: "Stylo Extended Pillar Cock", code: "272211520121", mrp: 2260 },
      { name: "Stylo Pillar Cock", code: "272211520031", mrp: 1020 },
      { name: "Stylo Exp Part for High/3-inlet Div.", code: "272111520031", mrp: 1420 },
      { name: "Stylo Bib Cock", code: "272211520011", mrp: 980 },
      { name: "Stylo Swan Neck with Swinging Spout TM", code: "272211520081", mrp: 1930 },
      { name: "Stylo Sink Mixer Wall Mounted", code: "272201520011", mrp: 3400 },
      { name: "Stylo Wall Mixer L Bend", code: "272201520061", mrp: 4350 },
      { name: "Stylo Two Way Angular Stop Cock", code: "272211520061", mrp: 1320 },
      { name: "Stylo Angular Stop Cock", code: "272211520041", mrp: 770 },
    ],
    somany.id,
    "Stylo",
    "SFS",
    0.3
  );

  await seedFaucets(
    [
      { name: "Chromo Single lever basin mixer 450 mm", code: "F1019451", mrp: 3650 },
      { name: "Chromo Pillar cock 305 mm long extended body", code: "F1019102", mrp: 3640 },
      { name: "Chromo Pillar cock with aerator", code: "F1019101", mrp: 1720 },
      { name: "Chromo Bib cock with wall flange and aerator", code: "F1019151", mrp: 1590 },
      { name: "Chromo Push type single lever concealed diverter 40 mm", code: "F1019703", mrp: 4860 },
      { name: "Chromo Pillar cock with swan neck spout left and aerator", code: "F1019104", mrp: 2390 },
      { name: "Chromo Sink cock 150 mm swivel spout", code: "F1019301", mrp: 2200 },
      { name: "Chromo Wall mixer with bend pipe for overhead shower", code: "F1019401", mrp: 5720 },
      { name: "Chromo Angle cock with wall flange", code: "F1019201", mrp: 1130 },
      { name: "Chromo 2-Way angle cock with wall flange", code: "F1019211", mrp: 2000 },
      { name: "Chromo Wall mounted basin spout", code: "F1019653", mrp: 4000 },
    ],
    cera.id,
    "Chromo",
    "CF",
    0.27,
    true
  );

  await seedFaucets(
    [
      { name: "Victor Basin Mixer", code: "F1015451", mrp: 3100 },
      { name: "Victor Pillar Cock (11.5” Extended Body)", code: "F1015102", mrp: 3090 },
      { name: "Victor Pillar Cock", code: "F1015101", mrp: 1465 },
      { name: "Victor Sink Mixer Wall Mounted", code: "F1015501", mrp: 3310 },
      { name: "Victor Sink Cock", code: "F1015251", mrp: 1650 },
      { name: "Victor Wall Mixer (3-in-1)", code: "F1015403", mrp: 5800 },
      { name: "Victor Wall Mixer with Bend Pipe", code: "F1015401", mrp: 5200 },
      { name: "Victor Concealed Diverter System", code: "F1015701", mrp: 3690 },
      { name: "Victor Bath Tub Spout with Wall Flange", code: "F1015661", mrp: 1175 },
      { name: "Victor Angle Cock", code: "F1015201", mrp: 1000 },
    ],
    cera.id,
    "Victor",
    "CF2",
    0.27
  );

  async function seedToilets(
    items: { name: string; mrp: number }[],
    brandId: string,
    imgPrefix: string
  ) {
    for (const [index, seat] of items.entries()) {
      const offer = Math.round(seat.mrp * 0.7);
      const slug = seat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await prisma.product.create({
        data: {
          storeId: store.id,
          categoryId: toilets.id,
          brandId,
          name: seat.name,
          slug,
          mrp: seat.mrp,
          price: offer,
          discountPercent: 30,
          material: "Ceramic",
          finish: "Glossy",
          color: "White",
          unit: "piece",
          stockQuantity: 15,
          isPublished: true,
          isFeatured: index < 2,
          collection: "Toilet Seats",
          shortDescription: "FLAT 30% OFF",
          seoTitle: `${seat.name} | Mohit Tiles`,
          sortOrder: index + 1,
        },
      });
      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: img(`${imgPrefix} ${index + 1}.png`),
          thumbnailUrl: img(`${imgPrefix} ${index + 1}.png`),
          alt: seat.name,
          sortOrder: 0,
        },
      });
    }
  }

  await seedToilets(
    [
      { name: "Somany Tango Toilet", mrp: 10690 },
      { name: "Somany Rambo Toilet", mrp: 11490 },
      { name: "Somany Nexo Toilet", mrp: 11990 },
      { name: "Somany Peezo Toilet", mrp: 13490 },
      { name: "Somany Jupiter Toilet", mrp: 12590 },
      { name: "Somany Keats Toilet", mrp: 12990 },
      { name: "Somany Marina Toilet", mrp: 14490 },
      { name: "Somany Denise Toilet", mrp: 20990 },
      { name: "Somany Tango(With Jet) Toilet", mrp: 13990 },
      { name: "Somany Optimus Neo Rimless", mrp: 12590 },
      { name: "Somany Sandy Toilet", mrp: 11490 },
      { name: "Somany Optimus Classique Toilet", mrp: 12990 },
    ],
    somany.id,
    "SS"
  );

  await seedToilets(
    [
      { name: "Cera Claris", mrp: 10500 },
      { name: "Cera Ceon", mrp: 10500 },
      { name: "Cera Cinova", mrp: 12610 },
      { name: "Cera Cyra", mrp: 12990 },
      { name: "Cera Cattler", mrp: 13890 },
      { name: "Cera Cona", mrp: 12880 },
      { name: "Cera Charm", mrp: 16650 },
      { name: "Cera Cubica pro", mrp: 8570 },
      { name: "Cera Sierra pro", mrp: 8990 },
      { name: "Cera Chanter pro", mrp: 9580 },
      { name: "Cera Carnival rimless", mrp: 11600 },
    ],
    cera.id,
    "CS"
  );

  // Placeholder category tiles for bathroom/living to keep category pages populated
  void washBasins;
  void bathroomTiles;
  void kitchen;
  void livingRoom;

  console.log("Seed complete.");
  console.log(`Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
