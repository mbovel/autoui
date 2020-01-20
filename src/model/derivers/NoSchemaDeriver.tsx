import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	isObjectProps,
	ObjectProps,
	isArrayProps,
	ArrayProps
} from "../../ui/Props";
import { Components } from "../../ui/Components";
import { Deriver } from "../Deriver";
import * as React from "react";
import { Auto } from "../../ui/Auto";

export function NoSchemaDeriver(UI: Components): Deriver {
	const renderObject = (props: ObjectProps) => {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<Auto {...childProps} key={key} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	};
	const renderArray = (props: ArrayProps) => {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<Auto {...childProps} key={key} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	};

	return function(props): DataProps {
		if (isStringProps(props)) {
			return { ...props, _component: UI.TextInput };
		} else if (isNumberProps(props)) {
			return { ...props, _component: UI.NumberInput };
		} else if (isBooleanProps(props)) {
			return { ...props, _component: UI.Checkbox };
		} else if (isObjectProps(props)) {
			return { ...props, _render: renderObject };
		} else if (isArrayProps(props)) {
			return { ...props, _render: renderArray };
		}
		throw new Error("");
	};
}
