import { InputProps } from "../../ui/Props";
import { ErrorList, mergeErrors, filterErrorsByPath } from "../../ui/Errors";
import { isFunction, mapValues } from "lodash-es";
import { ReactElement } from "react";
import { JSON, ensure, assert, pathAppend } from "../utils";
import { State, isBranchState } from "../state/State";

export type ArrayOrOne<T> = Array<T> | T;

export interface BaseSchema<Value extends JSON, Props> {
	render?: (props: Props) => ReactElement | null;
	validate?(data: Value): ErrorList;
	errors?: ErrorList;
	default?: Value;
}

export interface BranchProps {
	child(path: string): ReactElement;
	children: ReactElement[];
}

export interface BranchSchema<Value extends JSON> extends BaseSchema<Value, BranchProps> {
	children: { [key: string]: Schema; [key: number]: Schema };
	add?: { [key: string]: any } | any;
	canRemove?: boolean;
	handleDrop?: (content: any, index: number) => any | undefined;
	minimum?: number;
	maximum?: number;
}

export interface MapSchema extends BranchSchema<{ [key: string]: any }> {
	type: "map";
}

export interface ListSchema extends BranchSchema<any[]> {
	type: "list";
}

export interface StringSchema extends BaseSchema<string, InputProps<string>> {
	type: "string";
}

export interface NumberSchema extends BaseSchema<number, InputProps<number>> {
	type: "number";
}

export interface BooleanSchema extends BaseSchema<boolean, InputProps<boolean>> {
	type: "boolean";
}

export type StaticSchema = MapSchema | ListSchema | StringSchema | NumberSchema | BooleanSchema;
export type DynamicSchema = (data: any) => Schema;
export type Schema = StaticSchema | DynamicSchema;
export type ResolvedSchema =
	| ((MapSchema | ListSchema) & {
			children?: { [key: string]: ResolvedSchema; [key: number]: ResolvedSchema };
	  })
	| StringSchema
	| NumberSchema
	| BooleanSchema;

export namespace Schema {
	export function getChild(schema: ResolvedSchema, key: string): ResolvedSchema {
		ensure(schema.type === "map" || schema.type === "list");
		ensure(key in schema.children);
		return schema.children[key];
	}

	export function resolve(
		schema: Schema,
		state: State,
		inheritedErrors: ErrorList = undefined,
		path: string = ""
	): ResolvedSchema {
		const data = State.toJson(state);

		if (isFunction(schema)) return resolve(schema(data), state, inheritedErrors);

		ensure(schema.type === state.type);

		// The cast of `validate` is safe because of the above checks: type of data is ensured
		// to correspond to the type of schema.validate argument.
		const errors = mergeErrors(inheritedErrors, (schema.validate as any)?.(data as any[]));

		if (schema.type !== "list" && schema.type !== "map") return { ...schema, errors };

		assert(isBranchState(state));

		const children = mapValues(state.children, (childState, key) =>
			resolve(
				key in schema.children ? schema.children[key] : schema.children["$default"],
				childState,
				filterErrorsByPath(errors, path),
				pathAppend(path, key)
			)
		);

		return { ...schema, errors, children };
	}

	export function getDefaultData(schema: ResolvedSchema): any {
		if (schema.default) return schema.default;
		switch (schema.type) {
			case "map":
				if (schema.type === "map" && schema.children)
					return mapValues(schema.children, getDefaultData);
				return {};
			case "list":
				return [];
			case "string":
				return "";
			case "number":
				return 0;
			case "boolean":
				return false;
		}
	}
}
