import { Primitive, isPrimitive, MapFunction, ensure } from "./utils";

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

export function isBranchState(state: State): state is ListState | MapState {
	return state.type === "list" || state.type === "map";
}

export function fromJs(data: any, getKey: MapFunction<string>): State {
	if (isPrimitive(data)) {
		return { type: typeof data as any, value: data, touched: false, focusedBy: [] };
	} else if (isArray(data)) {
		const keys = data.map(getKey);
		const values = data.map(v => fromJs(v, getKey));
		return { type: "list", order: keys, children: zipObject(keys, values) };
	} else if (isObjectLike(data)) {
		return { type: "map", children: mapValues(data, v => fromJs(v, getKey)) };
	}
	throw new Error("");
}

export const toJson = memoize(function(state: State): JSON {
	switch (state.type) {
		case "map":
			return mapValues(state.children, toJson);
		case "list":
			return state.order.map(key => toJson(state.children[key]));
		default:
			return state.value;
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
