import express, { Request, Response, NextFunction } from 'express';
import users from '../users/users.js';

const port = 8000;
const app = express();

// regex can be used in the name of the route

app.all('/hello', function (req: Request, res: Response, next: NextFunction) {
	console.log('Sending back Hello');
	res.send('Hello');
	next();
});

// middleware
const middleware = (req: Request, res: Response, next: NextFunction): void => {
	console.log('Middleware called');
};

app.get('/', middleware, function (req, res, next) {
	res.send('Hello world');
	next();
});

app.use('/users', users);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err.message);
	res.status(401).send(err.message);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
