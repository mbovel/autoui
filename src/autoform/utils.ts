import {
	isUndefined,
	isString,
	isNumber,
	isBoolean,
	upperFirst,
	toLower,
	startCase
} from "lodash-es";

export function pathAppend(a: string, b: string) {
	if (a) return a + "." + b;
	else return b;
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

export type TypeOf<V extends Primitive> = V extends string
	? "string"
	: V extends number
	? "number"
	: "boolean";

export function typeOf<V extends Primitive>(value: V): TypeOf<V> {
	return typeof value as any;
}

export type Primitive = string | number | boolean;

export type JSON = JSON[] | { [key: string]: JSON } | Primitive;

export type MapFunction<R> = (value: unknown, index: number, array: unknown[]) => R;

export function ensure(condition: any, msg?: string): asserts condition {
	if (!condition) throw new Error(msg);
}

export function assert(condition: any, msg?: string): asserts condition {
	if (!condition) throw new Error(msg);
}
