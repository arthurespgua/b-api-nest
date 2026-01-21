export class UserValidatorService {
    static validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static validatePasswordComplexity(password: string): boolean {
        const hasUppercase   = /[A-Z]/.test(password);
        const hasLowercase   = /[a-z]/.test(password);
        const hasNumber      = /[0-9]/.test(password);
        const hasSpecialChar = /[^\p{L}\p{N}\s]/u.test(password);
        const isValidLength  = password.length >= 8;

        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isValidLength;
    }
}