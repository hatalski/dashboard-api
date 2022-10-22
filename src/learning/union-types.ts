let universalId: number | string = 5;

universalId = 'name';

function printId(id: number | string): void {
	if (typeof id == 'string') {
		console.log(id.toUpperCase());
	} else {
		console.log(id);
	}
}

function helloUser(user: string | string[]): void {
	if (Array.isArray(user)) {
		console.log(user.join(', ') + 'Hi!');
	} else {
		console.log(user + 'hi');
	}
}

type coord = { lat: number; lon: number };

interface ICoord {
	lat: number;
	lon: number;
}

type ID = number | string;

function compute(coord: ICoord): number {
	return coord.lat * coord.lon;
}

interface Animal {
	name: string;
}

interface Dog extends Animal {
	tail: boolean;
}

const dog: Dog = {
	name: 'H',
	tail: true,
};
