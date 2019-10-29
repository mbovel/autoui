export function memoize1<A extends Object, B, T extends Array<any>>(
	f: (arg: A, ...otherArgs: T) => B
) {
	const cache = new WeakMap<A, B>();
	return (arg: A, ...otherArgs: T): B => {
		if (cache.has(arg)) return cache.get(arg)!;
		const result: B = f(arg, ...otherArgs);
		cache.set(arg, result);
		return result;
	};
}

export function last<T extends Array<any>>(array: T) {
	return array[array.length - 1];
}
