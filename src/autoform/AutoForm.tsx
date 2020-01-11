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

type IProps<V extends { [key: string]: unknown }> = { value: V; children(key: keyof V): void };
function I<V>(props: IProps<V>) {
	return <span>{props.children()}</span>;
}

export const test = <I value="string">{() => "asd"}</I>;

_AutoForm.defaultProps = {
	path: "",
	user: ""
};

export const AutoForm = memo(_AutoForm);

export const schema = {
	name: {
		type: "string",
		validate(value: string) {
			if (!value) {
				return "Required";
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
				return "Invalid email address";
			}
		}
	}
};
