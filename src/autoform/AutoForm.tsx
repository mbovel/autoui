import { Action } from "./Action";
import { ReactElement, memo } from "react";
import * as React from "react";
import {
	pathAppend,
	JSON,
	filterByPath,
	isPrimitive,
	titleCase,
	pathLast,
	Primitive,
	arrayShallowEqual,
	ensure
} from "./utils";
import { RenderFunction, RenderPropsFromData, RenderProps } from "./RenderProps";
import { isArray, mapValues, isPlainObject } from "lodash-es";
import { State, getTouchedTreeChild } from "./State";
import { UIError } from "../ui/Props";

export interface AutoFormProps<D extends JSON> extends State<D> {
	path?: string;
	render?: (props: RenderProps, data: JSON, path: string) => ReactElement | null;
	validate?: (data: JSON, path: string) => UIError[];
	dispatch: (action: Action) => void;
	children?: (props: RenderPropsFromData<D>) => ReactElement | null;
	inheritedErrors?: UIError[];
	user?: string;
}

function _AutoForm<D extends JSON>(props: AutoFormProps<D>): ReactElement | null {
	const {
		data,
		touched,
		active = [],
		path = "",
		render,
		validate,
		dispatch,
		children,
		inheritedErrors = [],
		user = ""
	} = props;
	ensure(data);
	const label = titleCase(pathLast(path));
	const errors = validate ? inheritedErrors.concat(validate(data, path)) : inheritedErrors;

	let renderProps: RenderProps;
	if (isPrimitive(data)) {
		renderProps = {
			value: data,
			errors,
			label,
			onChange: (value: Primitive) => dispatch({ type: "set", path, value }),
			onBlur: () => dispatch({ type: "blur", path, user }),
			onFocus: () => dispatch({ type: "focus", path, user })
		};
	} else {
		function child(data: any, key: string | number) {
			const childPath = pathAppend(path, key);
			return (
				<AutoForm
					{...props}
					data={data[key]}
					touched={getTouchedTreeChild(touched, key)}
					active={filterByPath(active, childPath)}
					inheritedErrors={filterByPath(errors, childPath)}
				/>
			);
		}

		if (isArray(data)) renderProps = { children: data.map(child) };
		else if (isPlainObject(data)) renderProps = { children: mapValues(data, child) };
		else throw new Error("");
	}

	if (children) return children(renderProps as RenderPropsFromData<D>);
	else if (render) return render(renderProps, data, path);
	throw new Error("");
}

export const AutoForm = memo(
	_AutoForm,
	(prevProps, props) =>
		prevProps.data === props.data &&
		prevProps.touched === props.touched &&
		arrayShallowEqual(prevProps.active, props.active) &&
		prevProps.path === props.path &&
		prevProps.render === props.render &&
		prevProps.validate === props.validate &&
		prevProps.dispatch === props.dispatch &&
		prevProps.children === props.children &&
		arrayShallowEqual(prevProps.inheritedErrors, props.inheritedErrors) &&
		prevProps.user === props.user
) as typeof _AutoForm;

export type Data = { firstname: string };

export const foo = (
	<AutoForm<Data>>
		{props => (
			<div>
				<div>{props.children.firstname}</div>
			</div>
		)}
	</AutoForm>
);

export function renderWith<D extends JSON>(
	element: ReactElement<AutoFormProps<D>>,
	render: RenderFunction<RenderPropsFromData<D>>
): ReactElement<AutoFormProps<D>> {
	return { ...element, props: { ...element.props, children: render } };
}

export function renderAllWith<D extends JSON>(
	elements: ReactElement<AutoFormProps<D>>[],
	render: RenderFunction<RenderPropsFromData<D>>
): ReactElement<AutoFormProps<D>>[] {
	return elements.map(el => renderWith(el, render));
}
