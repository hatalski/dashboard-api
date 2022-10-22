const a = 5;
const b = '4';
const c: number = a + Number(b);

const d = true;

const names: string[] = ['name', 'name 2'];

const numbers: number[] = [2, 5];

const tup: [number, string] = [2, 'hello'];
tup.push('name');

let e: unknown = 4;
e = 'name';
e = true;

const anyArr: unknown[] = ['name', 4, true];

function greet(name: string): string {
	return name + ' hello';
}

names.map((n: string) => n);

function coord(coord: { lat: number; long?: number }): number {
	return coord.lat * (coord?.long ?? 0);
}
