import { Inject, Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { UserRepository } from '@users/domain/repositories/user-repository.interface';

@Injectable()
export class DeleteUserUseCase {
    private readonly logger = new Logger(DeleteUserUseCase.name);

    constructor(
        @Inject('UserRepository') private readonly userRepository : UserRepository,
    ) {}

    async execute(id: string): Promise<void> {
        try {
            // 1. Verify if the user exists
            const exists = await this.userRepository.existsById(id);
            if (!exists) throw new NotFoundException(`User with ID ${id} not found`);

            // 2. Delete the user (Sessions and Tasks will be deleted automatically via CASCADE)
            await this.userRepository.delete(id);
            this.logger.log(`User and all related data deleted successfully: ${id}`);
        } catch (error) {
            this.logger.error(`DeleteUserUseCase Error: ${error.message}`, error.stack);

            // Re-throw known exceptions
            if (error instanceof NotFoundException) throw error;

            // Wrap unknown errors in an InternalServerErrorException
            throw new InternalServerErrorException('Failed to delete user');
        }
    }
}