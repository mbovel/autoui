export function pathAppend(a: string, b: string) {
	if (a) return a + "." + b;
	else return b;
}

export function pathLast(p: string) {
	return p.slice(p.lastIndexOf(".") + 1);
}
