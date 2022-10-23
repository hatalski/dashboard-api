import { compare, hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		_passwordHash?: string,
	) {
		if (_passwordHash) {
			this._password = _passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePasswords(pass: string): Promise<boolean> {
		console.log(pass);
		console.log(this.password);

		return compare(pass, this.password);
	}
}
