import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../app/common/helpers/passwordUtils';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed database...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'Password123!';

    const hashedPassword = await hashPassword(adminPassword);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            fullName: 'System Admin',
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            fullName: 'System Admin',
            role: 'ADMIN',
        },
    });

    console.log(`Upserted admin user: ${adminUser.email}`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
