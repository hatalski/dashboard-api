import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const result = await request(application._app)
			.post('/users/register')
			.send({ email: 'a2@a.ru', password: '1' });
		//console.log(result);

		expect(result.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const result = await request(application._app)
			.post('/users/login')
			.send({ email: 'a2@a.ru', password: '1' });
		expect(result.statusCode).toBe(200);
		expect(result.body.jwt).toBeDefined();
	});

	it('Login - wrong password', async () => {
		const result = await request(application._app)
			.post('/users/login')
			.send({ email: 'a2@a.ru', password: '2' });
		expect(result.statusCode).toBe(401);
	});

	it('Info - not authorized', async () => {
		const info = await request(application._app)
			.get('/users/info')
			.set('Authorization', `Bearer 1`);

		expect(info.statusCode).not.toBe(200);
		expect(info.body.error).toBeDefined();
	});

	it('Info - success', async () => {
		const result = await request(application._app)
			.post('/users/login')
			.send({ email: 'a2@a.ru', password: '1' });

		const jwt = result.body.jwt;

		const info = await request(application._app)
			.get('/users/info')
			.set('Authorization', `Bearer ${jwt}`);

		expect(info.statusCode).toBe(200);
		expect(info.body.email).toBe('a2@a.ru');
		expect(info.body.id).toBeDefined();
	});
});

afterAll(() => {
	application.close();
});
