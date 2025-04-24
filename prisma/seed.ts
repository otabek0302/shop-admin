import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin", 10);

    await prisma.user.upsert({
        where: { email: "admin@gmail.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@gmail.com",
            password,
            role: "ADMIN",
        },
    });

    console.log("✅ Seed complete.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });