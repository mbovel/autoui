export type RecursiveFunction<V, A extends unknown[], R> = (
	value: V,
	self: RecursiveFunction<V, A, R>,
	...a: A
) => R | undefined;

export function merge<A extends unknown[], R>(...fns: Array<(...args: A) => R | undefined>) {
	return function all(...a: A) {
		for (const fn of fns) {
			const result = fn(...a);
			if (result) return result;
		}
		throw new Error("No mapper handling value " + a[0]);
	};
}

export function tryBoth<Args extends unknown[], FReturnType, GReturnType>(
	f: (...args: Args) => FReturnType,
	g: (...args: Args) => GReturnType
) {
	return (...args: Args) => f(...args) || g(...args);
}

export function defined<Args extends unknown[], FReturnType>(
	f: (...args: Args) => FReturnType | undefined
) {
	return (...args: Args) => {
		const result = f(...args);
		if (!result) throw new Error("");
		return result;
	};
}
