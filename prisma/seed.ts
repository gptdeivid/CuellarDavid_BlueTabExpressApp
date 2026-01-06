import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.user.deleteMany();

    // Create sample users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                id: 'user1',
                name: 'John Doe',
            },
        }),
        prisma.user.create({
            data: {
                id: 'user2',
                name: 'Jane Smith',
            },
        }),
        prisma.user.create({
            data: {
                id: 'user3',
                name: 'Bob Wilson',
            },
        }),
    ]);

    console.log('Seeded users:', users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
