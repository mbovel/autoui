import { JSONType, JSONObject, JSONArray, Primitive } from "../model/utils";
import { ReactElement, ComponentType } from "react";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";

export interface UIError {
	path: string;
	message: string;
}

export interface BaseDataProps<D> {
	data: D;
	label?: string;
	errors?: UIError[];
	active?: boolean;
	selected?: boolean;
	selectable?: boolean;

	onFocus?: () => void;
	onBlur?: () => void;

	// TODO: should this really be here?
	_render?(props: this): ReactElement;
	_component?: ComponentType<this>;
	_path?: string;
}

export interface PrimitiveProps<D extends Primitive = Primitive> extends BaseDataProps<D> {
	onChange: (data: D) => void;
}

export interface ObjectProps<D extends JSONObject = JSONObject> extends BaseDataProps<D> {
	children: { [K in keyof D]: DataPropsOf<D[K]> };
	order?: string[];
}

export interface ArrayProps<D extends JSONArray = JSONArray> extends BaseDataProps<D> {
	children: { [key: string]: DataPropsOf<D[number]> };
	order: string[];
	selectScope?: boolean;

	insertAfter?(index: number, value: D[number]): void;
	remove?(key: string): void;
	sort?(comparator: (a: D[number], b: D[number]) => number): void;
}

// See https://github.com/Microsoft/TypeScript/issues/29368#issuecomment-453529532
export type DataPropsOf<D extends JSONType = JSONType> = [D] extends [Primitive]
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
	return isPlainObject(props.data);
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

export interface SelectProps<D extends string = any> extends InputProps<D> {
	options: { [key in D]: string };
}

export interface SectionProps {
	title: string;
}
