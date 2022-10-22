function Wallet(amount: number): Function {
	console.log('called Wallet decorator function...');

	return (target: Function): void => {
		console.log('changing the amount of the target function/class');
		target.prototype.amount = amount;
	};
}

function Logger(): Function {
	console.log('init Logger decorator');
	return (target: Function): void => {
		console.log('Logger callback to function/class');
	};
}

function Method(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor): void {
	console.log(propertyKey);
	//const oldValue = propertyDescriptor.value;
	propertyDescriptor.value = function (...args: any[]) {
		return args[0] * 10;
	};
}

function Prop(target: Object, propertyKey: string): void {
	let value: number;
	const getter = (): number => {
		console.log('Get!');

		return value;
	};

	const setter = (newValue: number): void => {
		console.log('Set!');
		value = newValue;
	};

	Object.defineProperty(target, propertyKey, {
		get: getter,
		set: setter,
	});
}

function Param(target: Object, propertyKey: string, index: number): void {
	console.log(`${target} ${propertyKey} ${index}`);
}

@Logger()
@Wallet(5000)
export class Person {
	@Prop id: number;
	name: string;
	amount: number;

	updateId(@Param newId: number): number {
		this.id = newId;
		return this.id;
	}

	@Method
	updateAmount(newAmount: number): number {
		this.amount = newAmount;
		return this.amount;
	}
}

const person = new Person();
console.log(person.amount);
console.log(person.updateAmount(2));
const newId = person.updateId(1);
