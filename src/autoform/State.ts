import { Primitive, isPrimitive, MapFunction, ensure, JSONArray, JSONObject } from "./utils";

import {
	memoize,
	mapValues,
	isArray,
	zipObject,
	isObjectLike,
	toPath,
	initial,
	last
} from "lodash-es";

import { JSON } from "./utils";

export interface BranchState {
	children: { [key: string]: State };
}

export interface MapState extends BranchState {
	type: "map";
}

export interface ListState extends BranchState {
	type: "list";
	order: string[];
}

export interface PrimitiveState<V> {
	value: V;
	touched: boolean;
	focusedBy: string[];
}

export interface StringState extends PrimitiveState<string> {
	type: "string";
}

export interface NumberState extends PrimitiveState<number> {
	type: "number";
}

export interface BooleanState extends PrimitiveState<boolean> {
	type: "boolean";
}

export type State = MapState | ListState | StringState | NumberState | BooleanState;

export type StateOf<D extends JSON> = D extends string
	? StringState
	: D extends number
	? NumberState
	: D extends boolean
	? BooleanState
	: D extends JSONObject
	? MapState
	: D extends JSONArray
	? ListState
	: never;

export type DataOf<S extends State> = S extends StringState
	? string
	: S extends NumberState
	? number
	: S extends BooleanState
	? boolean
	: S extends MapState
	? { [K in keyof S["children"]]: DataOf<S["children"][K]> }
	: S extends ListState
	? Array<DataOf<S["children"][string]>>
	: never;

export function isBranchState(state: State): state is ListState | MapState {
	return state.type === "list" || state.type === "map";
}

export function fromJson<D extends JSON>(data: D, getKey: MapFunction<string>): StateOf<D> {
	if (isPrimitive(data)) {
		const result: StateOf<string | number | boolean> = {
			type: typeof data as any,
			value: data,
			touched: false,
			focusedBy: []
		};
		return result as StateOf<D>;
	} else if (isArray(data)) {
		const keys = data.map(getKey);
		const values = data.map(v => fromJson(v, getKey));
		const children = zipObject(keys, values);
		const result: StateOf<JSONArray> = { type: "list", order: keys, children };
		return result as StateOf<D>;
	} else if (isObjectLike(data)) {
		const children = mapValues(data as JSONObject, v => fromJson(v, getKey));
		const result: StateOf<JSONObject> = { type: "map", children };
		return result as StateOf<D>;
	}
	throw new Error("");
}

export const toJson = memoize(function<D extends JSON>(state: StateOf<D>): D {
	switch (state.type) {
		case "map": {
			const s = state as MapState;
			const result: JSONObject = mapValues(s.children, toJson);
			return result as D;
		}
		case "list": {
			const s = state as ListState;
			const result: JSONArray = s.order.map(key => toJson(s.children[key]));
			return result as D;
		}
		default: {
			const s = state as StringState | NumberState | BooleanState;
			return s.value as D;
		}
	}
});

export function set(state: State, path: string, value: Primitive): void {
	const target = get(state, path);
	ensure(!isBranchState(target), "Cannot set value of branch.");
	target.value = value;
}

export function blur(state: State, path: any, user: string): void {
	const target = get(state, path);
	ensure(!isBranchState(target), "Cannot blur branch.");
	target.touched = true;
	target.focusedBy = target.focusedBy.filter(u => u !== user);
}

export function focus(state: State, path: string, user: string): void {
	const target = get(state, path);
	ensure(!isBranchState(target), "Cannot focus branch.");
	target.focusedBy.push(user);
}

function get(state: State, path: any): State {
	return toPath(path).reduce(getChildState, state);
}

export function getChildState(state: State, key: string): State {
	ensure(isBranchState(state), "Cannot get child of primitive.");
	ensure(key in state.children);
	return state.children[key];
}

const MAX = Number.MAX_SAFE_INTEGER;
export function addChildState(state: State, path: string, value: State, index: number = MAX): void {
	const pathArray = toPath(path);
	const target = get(state, initial(pathArray));
	ensure(isBranchState(target), "Cannot add child to primitive.");
	const key = last(pathArray);
	ensure(key, "Cannot add child at empty path.");
	target.children[key] = value;
	if (target.type === "list") target.order.splice(index, 0, key);
}

export function removeChildState(state: State, path: any): void {
	const pathArray = toPath(path);
	const target = get(state, initial(pathArray));
	ensure(isBranchState(target), "Cannot remove child to primitive.");
	const key = last(pathArray);
	ensure(key, "Cannot remove property at empty path.");
	delete target.children[key];
}
