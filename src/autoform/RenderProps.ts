import { PrimitiveProps } from "../ui/Props";
import { JSONObject, JSONArray, JSONType } from "./utils";
import { ReactElement } from "react";
import { AutoFormProps } from "./AutoForm";

export interface StringRenderProps extends PrimitiveProps<string> {}

export interface NumberRenderProps extends PrimitiveProps<number> {
	min: number;
	max: number;
	multipleOf: number;
}

export interface BooleanRenderProps extends PrimitiveProps<boolean> {}

export interface ObjectRenderProps<D extends JSONObject = JSONObject> {
	children: {
		[K in keyof D]: ReactElement<AutoFormProps<D[K]>>;
	};
}

export interface ArrayRenderProps<D extends JSONArray = JSONArray> {
	children: Array<ReactElement<AutoFormProps<D[number]>>>;
	insertAt(index: number, value: JSONType): void;
	removeAt(index: number): void;
}

export type RenderProps =
	| StringRenderProps
	| NumberRenderProps
	| BooleanRenderProps
	| ObjectRenderProps
	| ArrayRenderProps;

export type RenderPropsFromData<D extends JSONType> = D extends string
	? StringRenderProps
	: D extends number
	? NumberRenderProps
	: D extends boolean
	? BooleanRenderProps
	: D extends JSONObject
	? ObjectRenderProps<D>
	: D extends JSONArray
	? ArrayRenderProps<D>
	: never;

export type RenderFunction<P> = (props: P) => ReactElement;
