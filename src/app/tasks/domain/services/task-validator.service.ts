export class TaskValidatorService {
    static validateTaskDescription(description: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(description);
    }
}