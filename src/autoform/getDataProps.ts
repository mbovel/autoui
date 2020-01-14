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
	JSONObject,
	ArrayOrOne
} from "./utils";

import { DataPropsFrom, ArrayProps, ObjectProps, UIError } from "../ui/Props";
import { isArray, isObject, mapValues, toArray, isString } from "lodash-es";
import { ActivePath, getTouchedTreeChild } from "./State";

export function getDataProps<D extends JSONType>(
	data: D,
	touched: Tree<true | undefined>,
	activePaths: ActivePath[] = [],
	dispatch: (action: Action) => void,
	validate: (data: JSONType, path: string) => ArrayOrOne<UIError | string> = () => [],
	inheritedErrors: UIError[] = [],
	path: string = "",
	user: string = ""
): DataPropsFrom<D> {
	const label = titleCase(pathLast(path));
	const active = activePaths.some(it => it.path === path && it.user === user);
	const blur = () => dispatch({ type: "blur", path, user });
	const focus = () => dispatch({ type: "focus", path, user });
	const errors = !!touched
		? inheritedErrors.concat(
				toArray(validate(data, path)).map(it => (isString(it) ? { path, message: it } : it))
		  )
		: inheritedErrors;

	if (isPrimitive(data)) {
		const props: DataPropsFrom<Primitive> = {
			data,
			set: value => dispatch({ type: "set", path, data: value }),
			label,
			active,
			focus,
			blur,
			errors
		};
		return props as DataPropsFrom<D>;
	}

	function child(childData: any, key: string | number) {
		const childPath = pathAppend(path, key);
		return getDataProps(
			childData,
			getTouchedTreeChild(touched, key),
			filterByPath(activePaths, childPath),
			dispatch,
			validate,
			filterByPath(errors, childPath),
			childPath,
			user
		);
	}

	if (isArray(data)) {
		const props: ArrayProps<JSONArray> = {
			data,
			children: data.map(child),
			insertAfter: (index, data) => dispatch({ type: "insertAfter", path, index, data }),
			removeAt: index => dispatch({ type: "removeAt", path, index }),
			sort: compare => dispatch({ type: "sort", path, compare }),
			active,
			focus,
			blur,
			errors
		};
		return props as DataPropsFrom<D>;
	}

	if (isObject(data)) {
		const props: ObjectProps<JSONObject> = {
			data: data as JSONObject,
			children: mapValues(data, child),
			set: (key, data) => dispatch({ type: "set", path: pathAppend(path, key), data }),
			unset: key => dispatch({ type: "unset", path: pathAppend(path, key) }),
			active,
			focus,
			blur,
			errors
		};
		return props as DataPropsFrom<D>;
	}

	throw new Error("");
}
