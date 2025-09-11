import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@domana.app" },
    update: {},
    create: { email: "demo@domana.app", name: "Demo User" }
  });

  await prisma.listing.createMany({
    data: [
      { title: "BGC 1BR Condo", price: 12000000, lat: 14.55246, lng: 121.04532, userId: user.id },
      { title: "Cebu IT Park Studio", price: 6500000,  lat: 10.32902, lng: 123.90547, userId: user.id },
      { title: "Davao Family Home",  price: 8000000,  lat:  7.07071, lng: 125.61112, userId: user.id }
    ],
    skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());
