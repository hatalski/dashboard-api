import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Incorrectly formatted email.' })
	email: string;

	@IsString({ message: 'Password is not specified.' })
	password: string;
}
