export class HttpError extends Error {
	private _statusCode: number;
	private _context?: string;
	private _message: string;

	constructor(statusCode: number, message: string, context?: string) {
		super(message);
		this._statusCode = statusCode;
		this._message = message;
		this._context = context;
	}

	get context(): string | undefined {
		return this._context;
	}

	get statusCode(): number {
		return this._statusCode;
	}

	get message(): string {
		return this._message;
	}
}
