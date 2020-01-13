import { Tree, ensure } from "./utils";
import { Action } from "./Action";
import { set, toPath, isObject, omit, remove, unset, get, isArray } from "lodash-es";
import { JSON } from "./utils";

export interface ActivePath {
	path: string;
	user: string;
}

export interface State<D extends JSON = JSON> {
	data?: D;

	// Meta
	touched?: Tree<true | undefined>;
	active?: ActivePath[];
}

export function mutateState(state: State, action: Action): void {
	switch (action.type) {
		case "set":
			set(state, "data." + action.path, action.value);
			return;
		case "unset":
			unset(state, "data." + action.path);
			return;
		case "insertAt":
			getArray(state, "data." + action.path).splice(action.index, 0, action.value);
			return;
		case "removeAt":
			getArray(state, "data." + action.path).splice(action.index, 1);
			return;
		case "move":
			const value = getArray(state, "data." + action.fromPath).splice(action.fromIndex, 1)[0];
			getArray(state, "data." + action.toPath).splice(action.toIndex, 0, value);
			return;
		case "sort":
			getArray(state, "data." + action.path).sort(action.compare);
			return;
		case "focus":
			state.active = state.active ?? [];
			state.active.push(omit(action, "type"));
			return;
		case "blur":
			state.active = state.active ?? [];
			remove(state.active, el => el.path !== action.path && el.user !== action.user);

			// Touch if not already touched
			if (isTouched(state.touched, action.path)) return;
			set(state, "touched." + action.path, true);

			return;
	}
}

export function isTouched(tree: Tree<true | undefined>, path: string): boolean {
	return !!toPath(path).reduce(getTouchedTreeChild, tree);
}

export function getTouchedTreeChild(node: Tree<true | undefined>, key: string | number) {
	return isObject(node) ? node[key] : node;
}

function getArray(object: any, path: string): Array<any> {
	const array = get(object, path);
	ensure(isArray(array));
	return array;
}
