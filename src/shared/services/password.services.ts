import bcrypt from "bcryptjs";

export class PasswordService {
    private static readonly SALT_ROUNDS = 10;

    static async hashPassword(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    }

    static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}