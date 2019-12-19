import { isUndefined, isString, isNumber, isBoolean, isNull, isDate } from "lodash-es";

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

export type Primitive = string | number | boolean | null | Date;

export function isPrimitive(value: any): value is Primitive {
	return isString(value) || isNumber(value) || isBoolean(value) || isNull(value) || isDate(value);
}

export type Tree<V> = V | { [key: string]: Tree<V> };
