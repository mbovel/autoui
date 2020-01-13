import { Action } from "./Action";
import {
	JSONType,
	titleCase,
	pathLast,
	isPrimitive,
	pathAppend,
	Tree,
	Primitive,
	filterByPath,
	JSONArray,
	JSONObject
} from "./utils";

import { DataPropsFrom, PrimitiveProps, ListProps, MapProps } from "../ui/Props";
import { isArray, isObject, mapValues } from "lodash-es";
import { ActivePath, getTouchedTreeChild } from "./State";

export function getDataProps<D extends JSONType>(
	data: D,
	dispatch: (action: Action) => void,
	user: string = "",
	path: string = "",
	activePaths: ActivePath[] = [],
	touched: Tree<true | undefined> = undefined
): DataPropsFrom<D> {
	const label = titleCase(pathLast(path));
	const active = activePaths.some(it => it.path === path && it.user === user);
	const blur = () => dispatch({ type: "blur", path, user });
	const focus = () => dispatch({ type: "focus", path, user });

	if (isPrimitive(data)) {
		const props: PrimitiveProps<Primitive> = {
			value: data ?? "",
			set: value => dispatch({ type: "set", path, data: value }),
			label,
			active,
			focus,
			blur
		};
		return props as DataPropsFrom<D>;
	}

	function child(data: any, key: string | number) {
		const childPath = pathAppend(path, key);
		return getDataProps(
			data[key],
			dispatch,
			user,
			childPath,
			filterByPath(activePaths, childPath),
			getTouchedTreeChild(touched, key)
		);
	}

	if (isArray(data)) {
		const props: ListProps<JSONArray> = {
			children: data.map(child),
			insertAfter: (index, data) => dispatch({ type: "insertAfter", path, index, data }),
			removeAt: index => dispatch({ type: "removeAt", path, index }),
			sort: compare => dispatch({ type: "sort", path, compare }),
			active,
			focus,
			blur
		};
		return props as DataPropsFrom<D>;
	}

	if (isObject(data)) {
		const props: MapProps<JSONObject> = {
			children: mapValues(data, child),
			set: (key, data) => dispatch({ type: "set", path: pathAppend(path, key), data }),
			unset: key => dispatch({ type: "unset", path: pathAppend(path, key) }),
			active,
			focus,
			blur
		};
		return props as DataPropsFrom<D>;
	}

	throw new Error("");
}
