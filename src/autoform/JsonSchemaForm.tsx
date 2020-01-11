import {
	getChildState,
	StringState,
	NumberState,
	BooleanState,
	MapState,
	ListState,
	toJson,
	StateOf,
	DataOf,
	State
} from "./State";
import { Action } from "./Action";
import { memo, ReactElement, ComponentType } from "react";
import * as React from "react";
import { pathAppend, JSON, JSONObject, JSONArray, assert } from "./utils";
import { ErrorList, mergeErrors, filterErrorsByPath } from "../ui/Errors";
import { RenderProps, RenderFunction } from "./RenderProps";

function JsonSchemaForm<D extends JSON>({}: {
	data: D;
	children: RenderFunction<RenderProps<D>>;
	component: ComponentType<RenderProps<D>>;
}) {
	return <></>;
}

function _JsonSchemaForm<S extends State, D extends DataOf<S>>({
	dispatch,
	path = "",
	user = "",
	state
}: {
	state: S;
	path: string;
	dispatch?: (action: Action) => void;
	user: string;
	inheritedErrors: ErrorList;
	children: RenderFunction<RenderProps<D>>;
	component: ComponentType<RenderProps<D>>;
}) {
	function getChildProps(key: string) {
		const childPath = pathAppend(path, key);
		return {
			state: getChildState(state as any, key),
			dispatch,
			path: getChildProps,
			user,
			errors: filterErrorsByPath(errors, childPath)
		};
	}

	if (!state || !dispatch) {
		state = (null as any) as S;
		dispatch = () => {};
	}
	const errors = undefined;

	assert(state);
	return <></>;
}

const state: StringState = { type: "string", value: "coucou", touched: false, focusedBy: [] };

export const foo = (
	<JsonSchemaForm data={{ firstname: 2, lastname: 3, bop: 4, bla: 5 }}>
		{props => (
			<div>
				<div>{props.children.firstname}</div>
				<div>{props.children.lastname}</div>
				<div>{props.children.bop}</div>
				<div>{props.children.bla}</div>
			</div>
		)}
	</JsonSchemaForm>
);
