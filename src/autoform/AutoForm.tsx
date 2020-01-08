import { memo } from "react";
import { Action } from "./state/Action";
import { pathAppend, Primitive, pathLast, titleCase, ensure } from "./utils";
import { toPath } from "lodash-es";
import { Schema, ResolvedSchema } from "./schema/Schema";
import { State, isBranchState } from "./state/State";
import * as React from "react";

export interface Props {
	state: State;
	dispatch: (action: Action) => void;
	schema: ResolvedSchema;
	path: string;
	user: string;
}

function getChildProps(props: Props, key: string): Props {
	return {
		...props,
		path: pathAppend(props.path, key),
		state: State.getChild(props.state, key),
		schema: Schema.getChild(props.schema, key)
	};
}

function _AutoForm(props: Props) {
	const { path, state, dispatch, user, schema } = props;
	const label = titleCase(pathLast(path));
	if (schema.type === "map" || schema.type === "list") {
		const child = (relPath: string) => (
			<AutoForm {...toPath(relPath).reduce(getChildProps, props)} key={relPath} />
		);

		ensure(isBranchState(state));
		const children = Object.keys(state.children).map(child);

		ensure(schema.render);
		return schema.render({ child, children });
	} else {
		const commonProps = {
			errors: schema.errors,
			label,
			onChange: (value: Primitive) => dispatch({ type: "set", path, value }),
			onBlur: () => dispatch({ type: "blur", path, user }),
			onFocus: () => dispatch({ type: "focus", path, user })
		};

		ensure(schema.type === state.type);
		ensure(schema.render);
		return schema.render({ value: state.value as any, ...commonProps });
	}
}

_AutoForm.defaultProps = {
	path: "",
	user: ""
};

export const AutoForm = memo(_AutoForm);
