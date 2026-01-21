import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await prisma.users.upsert({
        where: { email: 'admin@bambu.com' },
        update: {},
        create: {
            name         : 'Admin',
            email        : 'admin@bambu.com',
            password     : hashedPassword,
            is_validated : true
        },
    });
    console.log('✅ User created:', user.name, '(' + user.email + ')');

    // 2. Create a Welcome Task for the Admin User
    const task = await prisma.tasks.create({
        data: {
            name        : 'Tarea de Bienvenida',
            description : 'Esta es tu primera tarea en el sistema de TODO List',
            priority    : 'MEDIA',
            status      : false,
            id_user     : user.id,
        },
    });
    console.log('✅ Completed task:', task.name);

    console.log('🌱 Seed completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
;
