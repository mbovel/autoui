import { isObject } from "lodash-es";

function arrayShallowEqual<A extends unknown[]>(a: A, b: A): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
	return true;
}

export interface CacheEntry<T extends unknown[], R> {
	tail: T;
	result: R;
}

export interface Cache<H, T extends unknown[], R> {
	set(head: H, entry: CacheEntry<T, R>): any;
	get(head: H): CacheEntry<T, R> | undefined;
}

export class DefaultCache<H, T extends unknown[], R> implements Cache<H, T, R> {
	private objectCache: Cache<object, T, R> = new WeakMap();
	private primitiveCache: Cache<any /*all but object*/, T, R> = new Map();

	set(head: H, entry: CacheEntry<T, R>): void {
		if (isObject(head)) this.objectCache.set(head, entry);
		else this.primitiveCache.set(head, entry);
	}

	get(head: H): CacheEntry<T, R> | undefined {
		if (isObject(head)) return this.objectCache.get(head);
		return this.primitiveCache.get(head);
	}
}

export function memoize<H, T extends unknown[], R>(
	fn: (head: H, ...tail: T) => R,
	cache: Cache<H, T, R> = new DefaultCache(),
	tailEqual: (a: T, b: T) => boolean = arrayShallowEqual
): typeof fn {
	return function(head, ...tail) {
		const cachedResult = cache.get(head);
		if (cachedResult && tailEqual(tail, cachedResult.tail)) return cachedResult.result;
		const result = fn(head, ...tail);
		cache.set(head, { tail, result });
		return result;
	};
}
