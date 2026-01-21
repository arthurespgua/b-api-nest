import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateAllUsers() {
    try {
        const result = await prisma.users.updateMany({
            where: {
                is_validated: false,
            },
            data: {
                is_validated: true,
            },
        });

        console.log(`✅ ${result.count} usuarios actualizados a is_validated = true`);
    } catch (error) {
        console.error('❌ Error al actualizar usuarios:', error);
    } finally {
        await prisma.$disconnect();
    }
}

validateAllUsers();
