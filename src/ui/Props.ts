import { JSONType, JSONObject, JSONArray, Primitive } from "../autoform/utils";
import { isString, isNumber, isBoolean, isArray, isObject } from "lodash-es";

export interface UIError {
	path: string;
	message: string;
}

export interface BaseDataProps<D> {
	data: D;
	active: boolean;
	label?: string;
	errors?: UIError[];

	focus: () => void;
	blur: () => void;
}

export interface PrimitiveProps<D extends Primitive> extends BaseDataProps<D> {
	set: (data: D) => void;
}

export interface ObjectProps<D extends JSONObject = JSONObject> extends BaseDataProps<D> {
	children: { [K in keyof D]: DataPropsFrom<D[K]> };

	set(key: string, value: D[string]): void;
	unset(key: string): void;
}

export interface ArrayProps<D extends JSONArray = JSONArray> extends BaseDataProps<D> {
	children: { [K in keyof D & number]: DataPropsFrom<D[number]> };

	insertAfter(index: number, value: D[number]): void;
	removeAt(index: number): void;
	sort(comparator: (a: D[number], b: D[number]) => number): void;
}

// See https://github.com/Microsoft/TypeScript/issues/29368#issuecomment-453529532
export type DataPropsFrom<D extends JSONType> = [D] extends [Primitive]
	? PrimitiveProps<D>
	: [D] extends [JSONObject]
	? ObjectProps<D>
	: [D] extends [JSONArray]
	? ArrayProps<D>
	: DataProps;

export type DataProps =
	| PrimitiveProps<string>
	| PrimitiveProps<number>
	| PrimitiveProps<boolean>
	| ObjectProps
	| ArrayProps;

export function isStringProps(props: DataProps): props is PrimitiveProps<string> {
	return isString(props.data);
}

export function isNumberProps(props: DataProps): props is PrimitiveProps<number> {
	return isNumber(props.data);
}

export function isBooleanProps(props: DataProps): props is PrimitiveProps<boolean> {
	return isBoolean(props.data);
}

export function isArrayProps(props: DataProps): props is ArrayProps {
	return isArray(props.data);
}

export function isObjectProps(props: DataProps): props is ObjectProps {
	return !isArray(props.data) && isObject(props.data);
}

export interface InputProps<D extends Primitive> extends PrimitiveProps<D> {
	title?: string;
	name?: string;
	id?: string;
	className?: string;
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	autofocus?: boolean;
}

export interface SectionProps {
	title: string;
}
