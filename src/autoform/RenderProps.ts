import { InputProps } from "../ui/Props";
import { JSONObject, JSONArray, JSON } from "./utils";
import { ReactElement } from "react";
import { AutoFormProps } from "./AutoForm";

export interface StringRenderProps extends InputProps<string> {}

export interface NumberRenderProps extends InputProps<number> {}

export interface BooleanRenderProps extends InputProps<boolean> {}

export interface ObjectRenderProps<D extends JSONObject = JSONObject> {
	children: {
		[K in keyof D]: ReactElement<AutoFormProps<D[K]>>;
	};
}

export interface ArrayRenderProps<D extends JSONArray = JSONArray> {
	children: Array<ReactElement<AutoFormProps<D[number]>>>;
}

export type RenderProps =
	| StringRenderProps
	| NumberRenderProps
	| BooleanRenderProps
	| ObjectRenderProps
	| ArrayRenderProps;

export type RenderPropsFromData<D extends JSON> = D extends string
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
