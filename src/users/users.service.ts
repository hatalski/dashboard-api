import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { ILoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(this.configService.get('SALT')));

		const existedUser = await this.usersRepository.find(email);

		if (existedUser) {
			return null;
		}

		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);

		if (!existedUser) {
			return false;
		}

		const user = new User(existedUser.email, existedUser.name, existedUser.password);
		const passMatches = await user.comparePasswords(password);
		console.log(passMatches);

		this.logger.log(
			`Password from db: ${existedUser.password} Password from a client: ${password}`,
		);

		if (!passMatches) {
			return false;
		}

		return true;
	}
}
