import {
	ensure,
	JSONType,
	JSONObject,
	JSONArray,
	Primitive,
	isPrimitive,
	isDefined
} from "./utils";
import { Action } from "./Action";
import toPath from "lodash/toPath";
import isArray from "lodash/isArray";
import zipObject from "lodash/zipObject";
import mapValues from "lodash/mapValues";
import keys from "lodash/keys";

export interface BaseState {
	focusedBy?: string[];
	selectedBy?: string[];
	touched?: boolean;
}

export interface PrimitiveState<D extends Primitive = Primitive> extends BaseState {
	value: D;
}

export interface ObjectState<D extends JSONObject = JSONObject> extends BaseState {
	children: { [K in keyof D]: StateOf<D[K]> };
}

export interface ArrayState<D extends JSONArray = JSONArray> extends BaseState {
	children: { [key: string]: StateOf<D[number]> };
	order: string[];
}

// See https://github.com/Microsoft/TypeScript/issues/29368#issuecomment-453529532
export type StateOf<D extends JSONType = JSONType> = [D] extends [Primitive]
	? PrimitiveState<D>
	: [D] extends [JSONObject]
	? ObjectState<D>
	: [D] extends [JSONArray]
	? ArrayState<D>
	: State;

export type State = PrimitiveState | ObjectState | ArrayState;

export function isPrimitiveState(state: State): state is PrimitiveState {
	return isDefined((state as any).value);
}

export function isArrayState(state: State): state is ArrayState {
	return (state as any).children && (state as any).order;
}

export function isObjectState(state: State): state is ObjectState {
	return (state as any).children && !(state as any).order;
}

export function isBranchState(state: State): state is ObjectState | ArrayState {
	return (state as any).children;
}

export function mutateState(state: State, action: Action, user: string = "me"): void {
	switch (action.type) {
		case "set":
			set(state, action.path, action.data);
			return;
		case "insertAfter":
			insertAfter(state, action.path, action.key, action.data, action.index);
			return;
		case "remove":
			remove(state, action.path, action.key);
			return;
		case "sort":
			sort(state, action.path, action.compare);
			return;
		case "focus":
			focus(state, action.path, user);
			return;
		case "blur":
			blur(state, action.path, user);
			return;
	}
}

export function stateFromJson<D extends JSONType>(data: D): StateOf<D>;
export function stateFromJson(data: JSONType): State;
export function stateFromJson(data: JSONType): State {
	if (isPrimitive(data)) {
		return { value: data };
	} else if (isArray(data)) {
		const order = keys(data);
		return { order, children: zipObject(order, data.map(stateFromJson)) };
	} else {
		return { children: mapValues(data, stateFromJson) };
	}
}

export function stateToJson<D extends JSONType>(state: StateOf<D>): D;
export function stateToJson(state: State): JSONType;
export function stateToJson(state: State): JSONType {
	if (isPrimitiveState(state)) {
		return state.value;
	} else if (isArrayState(state)) {
		return state.order.map(key => stateToJson<JSONType>(state.children[key]));
	} else {
		return mapValues(state.children, stateToJson);
	}
}

function set(state: State, path: string, value: Primitive): void {
	const target = get(state, path);
	ensure(!isBranchState(target), "Cannot set value of branch.");
	target.value = value;
}

function get(state: State, path: any): State {
	return toPath(path).reduce(getChildState, state);
}

function getChildState(state: State, key: string): State {
	ensure(isBranchState(state), "Cannot get child of primitive.");
	ensure(key in state.children, `${key} does not exist`);
	return state.children[key];
}

const MAX = Number.MAX_SAFE_INTEGER;
function insertAfter(
	state: State,
	path: string,
	key: string,
	value: State,
	index: number = MAX
): void {
	const target = get(state, path);
	ensure(isArrayState(target), "Can only insertAfter in array.");
	target.children[key] = value;
	target.order.splice(index, 0, key);
}

function remove(state: State, path: any, key: string): void {
	const target = get(state, path);
	ensure(isArrayState(target), "Can only remove in array.");
	ensure(key, "Cannot remove property at empty path.");
	delete target.children[key];
	target.order.splice(target.order.indexOf(key), 1);
}

export function sort(state: State, path: any, compare: (a: any, b: any) => number): void {
	const target = get(state, path);
	ensure(isArrayState(target), "Cannot only sort array.");
	target.order.sort((aKey, bKey) => compare(target.children[aKey], target.children[bKey]));
}

export function touch(state: State, path: string) {
	let current = state;
	for (const key of toPath(path)) {
		if (!current.touched) current.touched = true;
		current = getChildState(current, key);
	}
	if (!current.touched) current.touched = true;
}

export function blur(state: State, path: any, user: string): void {
	const target = get(state, path);
	touch(state, path);
	target.focusedBy = target.focusedBy?.filter(u => u !== user);
}

export function focus(state: State, path: string, user: string): void {
	const target = get(state, path);
	if (!target.focusedBy) target.focusedBy = [];
	target.focusedBy.push(user);
}

/*
function unselect(state: State, path: any, user: string): void {
	const target = get(state, path);
	target.selectedBy = target.selectedBy?.filter(u => u !== user);
}

function select(state: State, path: any, user: string): void {
	const target = get(state, path);
	if (!target.selectedBy) target.selectedBy = [];
	target.selectedBy.push(user);
}
*/
