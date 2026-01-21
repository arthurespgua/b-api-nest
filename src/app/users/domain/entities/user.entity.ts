import { PasswordService } from '@shared/services/password.services';
import { UserValidatorService } from '@users/domain/services/user-validator.service';

export class User {
    constructor(props: UserCreateProps){
        this.id          = props.id;
        this.name        = props.name;
        this.email       = props.email;
        this.password    = props.password;
        this.createAt    = props.createAt;
        this.isValidated = props.isValidated;
    }

    private readonly id          : string;
    private readonly name        : string;
    private readonly email       : string;
    private readonly password    : string;
    private readonly isValidated : boolean;
    private readonly createAt    : Date;

    // Getters
    getId() { return this.id; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getIsValidated() { return this.isValidated; }
    getCreateAt() { return this.createAt; }

    // Factory method
    static async create(props: UserCreateProps): Promise<User> {
        this.validateUserProps(props);

        const hashedPassword = await PasswordService.hashPassword(props.password);
        return new User({ ...props, password: hashedPassword });
    }

    // Validation method
    private static validateUserProps(props: UserCreateProps): void {
        if ( !UserValidatorService.validateEmail(props.email) ) {
            throw new Error('Email must be a valid email address with the format "address@domain.ext"');
        }
        if ( !UserValidatorService.validatePasswordComplexity(props.password) ) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
    }

    // Update method
    async withUpdate(updates: Partial<UserCreateProps>): Promise<User> {
        if ( updates.password && !UserValidatorService.validatePasswordComplexity(updates.password) ) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }

        return User.create({
            id           : this.id,
            name         : this.name,
            email        : this.email,
            password     : await PasswordService.hashPassword(this.password),
            isValidated  : this.isValidated,
            createAt     : this.createAt,
            ...updates
        });
    }
}

type UserCreateProps = {
    id           : string;
    name         : string;
    email        : string;
    password     : string;
    isValidated  : boolean;
    createAt     : Date;
};