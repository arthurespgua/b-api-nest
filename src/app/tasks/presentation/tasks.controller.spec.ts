import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './tasks.controller';
import { UserValidatorService } from '@users/domain/services/user-validator.service';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers : [UsersController],
            providers   : [UserValidatorService],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
