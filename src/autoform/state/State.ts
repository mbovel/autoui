import { Primitive, isPrimitive, MapFunction, ensure } from "../utils";

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

import { JSON } from "../utils";

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
	touched: boolean;
	focusedBy: string[];
	value: V;
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

export namespace State {
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

	function get(state: State, path: any): State {
		return toPath(path).reduce(getChild, state);
	}

	export function getChild(state: State, key: string): State {
		ensure(isBranchState(state), "Cannot get child of primitive.");
		ensure(key in state.children);
		return state.children[key];
	}

	export function set(state: State, path: string, value: Primitive): void {
		const target = get(state, path);
		ensure(!isBranchState(target), "Cannot set value of branch.");
		target.value = value;
	}

	const MAX = Number.MAX_SAFE_INTEGER;
	export function add(state: State, path: string, value: State, index: number = MAX): void {
		const pathArray = toPath(path);
		const target = get(state, initial(pathArray));
		ensure(isBranchState(target), "Cannot add property to primitive.");
		const key = last(pathArray);
		ensure(key, "Cannot add property at empty path.");
		target.children[key] = value;
		if (target.type === "list") target.order.splice(index, 0, key);
	}

	export function remove(state: State, path: any): void {
		const pathArray = toPath(path);
		const target = get(state, initial(pathArray));
		ensure(isBranchState(target), "Cannot remove property to primitive.");
		const key = last(pathArray);
		ensure(key, "Cannot remove property at empty path.");
		delete target.children[key];
	}

	export function blur(state: State, path: any, user: string): void {
		const target = get(state, path);
		ensure(!isBranchState(target), "Cannot blur branch.");
		target.touched = true;
		target.focusedBy.filter(u => u !== user);
	}

	export function focus(state: State, path: string, user: string): void {
		const target = get(state, path);
		ensure(!isBranchState(target), "Cannot focus branch.");
		target.focusedBy.push(user);
	}
}
