import { memo, createElement } from "react";
import { Primitive, pathLast, titleCase, ensure, assert } from "./utils";
import { toPath } from "lodash-es";
import { isBranchState } from "./State";
import * as React from "react";
import { RenderProps } from "./RenderProps";
import { AutoFormProps, getChildAutoFormProps } from "./AutoFormProps";

export function getRenderProps(props: AutoFormProps): RenderProps {
	const { path, state, dispatch, user, derived } = props;
	ensure(derived.type === state.type, "Incompatible state and derived data");
	const label = titleCase(pathLast(path));
	if (derived.type === "map" || derived.type === "list") {
		assert(isBranchState(state));
		const child = (relPath: string) => (
			<AutoForm {...toPath(relPath).reduce(getChildAutoFormProps, props)} key={relPath} />
		);
		const children = Object.keys(state.children).map(child);
		return { child, children };
	} else {
		assert(!isBranchState(state));
		return {
			value: state.value,
			errors: derived.errors,
			label,
			onChange: (value: Primitive) => dispatch({ type: "set", path, value }),
			onBlur: () => dispatch({ type: "blur", path, user }),
			onFocus: () => dispatch({ type: "focus", path, user })
		};
	}
}

function _AutoForm(props: AutoFormProps) {
	const { render, component } = props.derived;
	const renderProps = getRenderProps(props);
	if (render) return render(renderProps as any);
	else if (component) return createElement(component as any, renderProps as any);
	throw new Error("");
}

_AutoForm.defaultProps = {
	path: "",
	user: ""
};

export const AutoForm = memo(_AutoForm);
