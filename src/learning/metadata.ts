import 'reflect-metadata';

function Injectable(key: string) {
	return (target: Function): void => {
		Reflect.defineMetadata(key, 1, target);
		const meta = Reflect.getMetadata(key, target);
		console.log(meta);
	};
}

function Inject(key: string) {
	return (target: Function): void => {
		Reflect.defineMetadata(key, 1, target);
		const meta = Reflect.getMetadata(key, target);
		console.log(meta);
	};
}

function Prop(target: Object, name: string): void {
	console.log(name);
}

@Injectable('C')
export class C {
	@Prop prop: number;
}

export class D {
	constructor(c: C) {
		console.log(c.prop);
	}
}
