import isUndefined from "lodash/isUndefined";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import upperFirst from "lodash/upperFirst";
import toLower from "lodash/toLower";
import startCase from "lodash/startCase";
import isEmpty from "lodash/isEmpty";
import isArrayLike from "lodash/isArrayLike";

export function pathAppend(a: string, b: string | number): string {
	if (a) return a + "." + b;
	else return b.toString();
}

export function pathLast(p: string) {
	return p.slice(p.lastIndexOf(".") + 1);
}

export function pathHead(p: string) {
	const dotIndex = p.indexOf(".");
	if (dotIndex === -1) return p;
	return p.slice(0, dotIndex);
}

export function pathTail(p: string) {
	const dotIndex = p.indexOf(".");
	if (dotIndex === -1) return "";
	return p.slice(dotIndex + 1);
}

export function isDefined<S>(value: S | undefined): value is S {
	return !isUndefined(value);
}

export function titleCase(str: string): string {
	return upperFirst(toLower(startCase(str)));
}

export function isPrimitive(value: any): value is Primitive {
	return isString(value) || isNumber(value) || isBoolean(value);
}

export function filterByPath<I extends { path: string }>(a: I[], path: string): I[] {
	return a.filter(it => it.path.startsWith(path));
}

export type TypeOf<V extends Primitive> = V extends string
	? "string"
	: V extends number
	? "number"
	: "boolean";

export function typeOf<V extends Primitive>(value: V): TypeOf<V> {
	return typeof value as any;
}

export type Primitive = string | number | boolean;

export type JSONArray = JSONType[];
export type JSONObject = { [key: string]: JSONType };
export type JSONType = JSONArray | JSONObject | Primitive;

export type MapFunction<R> = (value: unknown, index: number, array: unknown[]) => R;

export function ensure(condition: any, msg?: string): asserts condition {
	if (!condition) throw new Error(msg);
}

export function assert(condition: any, msg?: string): asserts condition {
	if (!condition) throw new Error(msg);
}

export function arrayShallowEqual(a: any, b: any): boolean {
	if (a === b) return true;
	if (!isArrayLike(a) || !isArrayLike(b)) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; ++i) {
		if (!(isEmpty(a[i]) && isEmpty(b[i])) && a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

export type Tree<V> = V | { [key: string]: Tree<V> };

export type ArrayOrOne<T> = T[] | T;

export interface CacheEntry<A, R> {
	args: A;
	result: R;
}

export type Cache<K, V> = {
	set(key: K, value: V): any;
	get(key: K): V | undefined;
};

export function memoize<F extends (...args: A) => R, A extends any[], R>(
	fn: F,
	cache: Cache<A[0], CacheEntry<A, R>> = new Map(),
	argsEqual: (a: A, b: A) => boolean = arrayShallowEqual
): F {
	return Object.assign((...args: A) => {
		const cached = cache.get(args[0]);
		if (cached && argsEqual(args, cached.args)) return cached.result;
		const result = fn(...args);
		cache.set(args[0], { args, result });
		return result;
	}, fn);
}

let uniqueKey = 0;
export function getUniqueKey(keys: string[]): string {
	while (keys.includes(uniqueKey.toString())) ++uniqueKey;
	return uniqueKey.toString();
}
