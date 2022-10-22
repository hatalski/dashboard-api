import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// middleware specific to this router
router.use((req: Request, res: Response, next: NextFunction) => {
	console.log('Time: ', Date.now());
	next();
});
// define the home page route
router.get('/', (req: Request, res: Response) => {
	res.send('Users home page');
});
// define the about route
router.get('/about', (req: Request, res: Response) => {
	res.send('About users');
});
export default router;
