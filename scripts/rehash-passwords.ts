import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function rehashUserPasswords() {
    try {
        // Obtener todos los usuarios
        const users = await prisma.users.findMany();

        for (const user of users) {
            // Verificar si la contraseña ya está hasheada (bcrypt hashes empiezan con $2a$ o $2b$)
            if (!user.password.startsWith('$2')) {
                console.log(`⚠️  Usuario ${user.email} tiene contraseña sin hashear. Actualizando...`);
                
                // Hashear la contraseña
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Actualizar en la base de datos
                await prisma.users.update({
                    where: { id: user.id },
                    data: { password: hashedPassword },
                });
                
                console.log(`✅ Contraseña actualizada para ${user.email}`);
            } else {
                console.log(`✓ Usuario ${user.email} ya tiene contraseña hasheada`);
            }
        }

        console.log('\n✅ Proceso completado');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

rehashUserPasswords();
