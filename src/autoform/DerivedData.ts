import { InputProps } from "../ui/Props";
import { ErrorList } from "../ui/Errors";
import { ReactElement, ComponentType } from "react";
import { JSON, ensure } from "./utils";
import { BranchRenderProps } from "./RenderProps";

export type ArrayOrOne<T> = Array<T> | T;

export interface BaseDerivedData<Value extends JSON, Props> {
	render?: (props: Props) => ReactElement | null;
	component?: ComponentType<Props>;
	errors?: ErrorList;
	default?: Value;
}

export interface BranchDerivedData<Value extends JSON>
	extends BaseDerivedData<Value, BranchRenderProps> {
	children: { [key: string]: DerivedData; [key: number]: DerivedData };
	add?: { [key: string]: any } | any;
	canRemove?: boolean;
	handleDrop?: (content: any, index: number) => any | undefined;
}

export interface MapDerivedData extends BranchDerivedData<{ [key: string]: any }> {
	type: "map";
}

export interface ListDerivedData extends BranchDerivedData<any[]> {
	type: "list";
}

export interface StringDerivedData extends BaseDerivedData<string, InputProps<string>> {
	type: "string";
}

export interface NumberDerivedData extends BaseDerivedData<number, InputProps<number>> {
	type: "number";
}

export interface BooleanDerivedData extends BaseDerivedData<boolean, InputProps<boolean>> {
	type: "boolean";
}

export type DerivedData =
	| MapDerivedData
	| ListDerivedData
	| StringDerivedData
	| NumberDerivedData
	| BooleanDerivedData;
export type DynamicDerivedData = (data: any) => DerivedData;

export function getChildDerivedData(DerivedData: DerivedData, key: string): DerivedData {
	ensure(DerivedData.type === "map" || DerivedData.type === "list");
	ensure(key in DerivedData.children);
	return DerivedData.children[key];
}
