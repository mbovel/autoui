import {
	ensure,
	JSONType,
	JSONObject,
	JSONArray,
	Primitive,
	isPrimitive,
	MapFunction
} from "./utils";
import { Action } from "./Action";
import { toPath, isArray, mapValues, zipObject } from "lodash-es";

export interface BaseState {
	focusedBy?: string[];
	selectedBy?: string[];
	touched?: boolean;
}

export interface PrimitiveState<D extends Primitive = Primitive> extends BaseState {
	value: D;
}

export interface ObjectState<D extends JSONObject = JSONObject> extends BaseState {
	children: { [K in keyof D]: State<D[K]> };
}

export interface ArrayState<D extends JSONArray = JSONArray> extends BaseState {
	children: { [key: string]: State<D[number]> };
	order: string[];
}

// See https://github.com/Microsoft/TypeScript/issues/29368#issuecomment-453529532
export type State<D extends JSONType = JSONType> = [D] extends [Primitive]
	? PrimitiveState<D>
	: [D] extends [JSONObject]
	? ObjectState<D>
	: [D] extends [JSONArray]
	? ArrayState<D>
	: PrimitiveState | ObjectState | ArrayState;

export function isPrimitiveState(state: State): state is PrimitiveState {
	return (state as any).value;
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

export function mutateState(state: State, action: Action): void {
	const user = "me";
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

let counter = 1;
export function defaultGetKey(value: any) {
	return (++counter).toString();
}

export function fromJs<D extends JSONType>(data: D, getKey?: MapFunction<string>): State<D>;
export function fromJs(data: JSONType, getKey?: MapFunction<string>): State;
export function fromJs(data: JSONType, getKey: MapFunction<string> = defaultGetKey): State {
	if (isPrimitive(data)) {
		return { value: data };
	} else if (isArray(data)) {
		const keys = data.map(getKey);
		const values = data.map(v => fromJs(v, getKey));
		return { order: keys, children: zipObject(keys, values) };
	} else {
		return { children: mapValues(data, v => fromJs(v, getKey)) };
	}
}

export function toJSON<D extends JSONType>(state: State<D>): D;
export function toJSON(state: State): JSONType;
export function toJSON(state: State): JSONType {
	if (isPrimitiveState(state)) {
		return state.value;
	} else if (isArrayState(state)) {
		return state.order.map(key => toJSON<JSONType>(state.children[key]));
	} else {
		return mapValues(state.children, toJSON);
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
	ensure(key in state.children);
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

function sort(state: State, path: any, compare: (a: any, b: any) => number): void {
	const target = get(state, path);
	ensure(isArrayState(target), "Cannot only sort array.");
	target.order.sort((aKey, bKey) => compare(target.children[aKey], target.children[bKey]));
}

function touch(state: State, path: string) {
	let current = state;
	for (const key of toPath(path)) {
		if (!current.touched) current.touched = true;
		current = getChildState(current, key);
	}
	if (!current.touched) current.touched = true;
}

function blur(state: State, path: any, user: string): void {
	const target = get(state, path);
	touch(state, path);
	target.focusedBy = target.focusedBy?.filter(u => u !== user);
}

function focus(state: State, path: string, user: string): void {
	const target = get(state, path);
	if (!target.focusedBy) target.focusedBy = [];
	target.focusedBy.push(user);
}

function unselect(state: State, path: any, user: string): void {
	const target = get(state, path);
	target.selectedBy = target.selectedBy?.filter(u => u !== user);
}

function select(state: State, path: any, user: string): void {
	const target = get(state, path);
	if (!target.selectedBy) target.selectedBy = [];
	target.selectedBy.push(user);
}
