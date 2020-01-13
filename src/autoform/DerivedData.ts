import { ReactElement } from "react";
import { JSON, ensure, JSONObject, JSONArray } from "./utils";
import { RenderPropsFromData } from "./RenderProps";
import { UIError } from "../ui/Props";
import { isNumber } from "lodash-es";

export interface BaseDerivedData<D extends JSON> {
	render?: (props: RenderPropsFromData<D>) => ReactElement | null;
	errors?: UIError[];
	default?: D;
}

export interface StringDerivedData extends BaseDerivedData<string> {
	type: "string";
}

export interface NumberDerivedData extends BaseDerivedData<number> {
	type: "number";
}

export interface BooleanDerivedData extends BaseDerivedData<boolean> {
	type: "boolean";
}

export interface ObjectDerivedData<D extends JSONObject = JSONObject> extends BaseDerivedData<D> {
	type: "object";
	children: { [K in keyof D]: DerivedDataFromData<D[K]> };
}

export interface ArrayDerivedData<D extends JSONArray = JSONArray> extends BaseDerivedData<D> {
	type: "array";
	children: { [K in keyof D & number]: DerivedDataFromData<D[K]> };
	add?: { [key: string]: any } | any;
	canRemove?: boolean;
	handleDrop?: (content: any, index: number) => any | undefined;
}

export type DerivedData =
	| StringDerivedData
	| NumberDerivedData
	| BooleanDerivedData
	| ObjectDerivedData<JSONObject>
	| ArrayDerivedData<JSONArray>;

export type DerivedDataFromData<D extends JSON> = D extends string
	? StringDerivedData
	: D extends number
	? NumberDerivedData
	: D extends boolean
	? BooleanDerivedData
	: D extends JSONObject
	? ObjectDerivedData<D>
	: D extends JSONArray
	? ArrayDerivedData<D>
	: never;

export function getChildDerivedData(derived: DerivedData, key: string | number): DerivedData {
	ensure(derived.type === "object" || derived.type === "array");
	ensure(key in derived.children);
	if (derived.type === "array") {
		ensure(isNumber(key));
		return derived.children[key];
	}
	return derived.children[key];
}
