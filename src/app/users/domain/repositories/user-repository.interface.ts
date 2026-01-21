import { User } from '../entities/user.entity';

export interface UserRepository {
    // Basic CRUD operations
    create(user: User)   : Promise<User>;
    findById(id: string) : Promise<User | null>;
    findAll()            : Promise<User[]>;
    update(user: User)   : Promise<User>;
    delete(id: string)   : Promise<void>;

    // Specific bussiness-rules operations
    existsByEmail(email: string)          : Promise<boolean>;
    existsById(id: string)                : Promise<boolean>;
    findByEmail(email: string)            : Promise<User | null>;
    findByEmailAndPassword(email: string) : Promise<User | null>;
}
