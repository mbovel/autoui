import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	ObjectProps,
	isObjectProps
} from "../../ui/Props";
import { Components } from "../../ui/Components";
import { Deriver } from "../Deriver";
import * as React from "react";
import { Auto } from "../../ui/Auto";
import mapValues from "lodash/mapValues";
import { memoize } from "../utils";
import { Dispatcher } from "../Dispatcher";

export function NoSchemaDeriver(UI: Components): Deriver {
	function renderObject(props: ObjectProps) {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<Auto {...childProps} key={key} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	}
	console.log("NoSchemaDeriver: constructs");

	const derive = memoize(function(props: DataProps, dispatch: Dispatcher): DataProps {
		console.log("NoSchemaDeriver: derive " + props._path);
		if (isStringProps(props)) {
			return { ...props, _component: UI.TextInput };
		} else if (isNumberProps(props)) {
			return { ...props, _component: UI.NumberInput };
		} else if (isBooleanProps(props)) {
			return { ...props, _component: UI.Checkbox };
		} else if (isObjectProps(props)) {
			return {
				...props,
				_render: renderObject,
				children: mapValues(props.children, child => derive(child, dispatch))
			};
		} else {
			return {
				...props,
				_component: UI.List,
				remove: mapValues(props.children, (_, key) => () =>
					dispatch({ type: "remove", path: props._path!, key })
				),
				children: mapValues(props.children, child => derive(child, dispatch))
			};
		}
	});

	return derive;
}
