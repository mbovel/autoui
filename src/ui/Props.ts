import { JSONType, JSONObject, JSONArray, Primitive } from "../autoform/utils";

export interface UIError {
	path: string;
	message: string;
}

export interface BaseProps {
	active: boolean;
	label?: string;
	errors?: UIError[];

	focus: () => void;
	blur: () => void;
}

/**
 * Change event handler
 *
 * @typeparam T value type.
 * @category Abstract
 */
export interface PrimitiveProps<T> extends BaseProps {
	value: T;

	set: (value: T) => void;
}

export interface MapProps<D extends JSONObject> extends BaseProps {
	children: { [K in keyof D]: DataPropsFrom<D[K]> };

	set(key: string, value: D[string]): void;
	unset(key: string): void;
}

export interface ListProps<D extends JSONArray> extends BaseProps {
	children: { [K in keyof D]: DataPropsFrom<D[number]> };

	insertAfter(index: number, value: D[number]): void;
	removeAt(index: number): void;
	sort(comparator: (a: D[number], b: D[number]) => number): void;
}

export type DataPropsFrom<D extends JSONType> = D extends Primitive
	? PrimitiveProps<D>
	: D extends JSONObject
	? MapProps<D>
	: D extends JSONArray
	? ListProps<D>
	: never;

export interface InputProps<T> extends PrimitiveProps<T> {
	title?: string;
	name?: string;
	id?: string;
	className?: string;
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	autofocus?: boolean;
}
