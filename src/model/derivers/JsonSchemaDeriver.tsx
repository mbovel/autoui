import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	ObjectProps,
	ArrayProps
} from "../../ui/Props";
import { Components } from "../../ui/Components";
import { Deriver } from "../Deriver";
import * as React from "react";
import { Auto } from "../../ui/Auto";
import mapValues from "lodash/mapValues";
import { memoize, JSONType, isDefined, ensure } from "../utils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import isNull from "lodash/isNull";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import { Dispatcher } from "../Dispatcher";

export function JsonSchemaDeriver(UI: Components, rootSchema: JSONSchema7): Deriver {
	function renderBranch(props: ObjectProps | ArrayProps) {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<Auto {...childProps} key={key} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	}

	console.log("JsonSchemaDeriver: constructs");

	const derive = memoize(function(
		props: DataProps,
		_: Dispatcher,
		schema: JSONSchema7 = rootSchema
	): DataProps {
		console.log("NoSchemaDeriver: derive " + props._path);
		if (isStringProps(props)) {
			return { ...props, _component: UI.TextInput };
		} else if (isNumberProps(props)) {
			return { ...props, _component: UI.NumberInput };
		} else if (isBooleanProps(props)) {
			return { ...props, _component: UI.Checkbox };
		} else {
			return {
				...props,
				_render: renderBranch,
				children: mapValues(props.children, child => derive(child, _, schema))
			};
		}
	});

	return derive;
}

export function getInitialData(schema: JSONSchema7Definition): JSONType {
	console.log(schema);
	ensure(!isBoolean(schema));

	if (isDefined(schema.default) && !isNull(schema.default)) return schema.default as JSONType;

	ensure(!isArray(schema.type), "Only supports a single type");

	if (schema.type === "string") return "";
	else if (schema.type === "number") return 0;
	else if (schema.type === "boolean") return false;
	else if (schema.type === "object" || schema.oneOf) {
		const children = schema.properties ? mapValues(schema.properties, getInitialData) : {};
		if (schema.oneOf) {
			const choices = Object.fromEntries(
				schema.oneOf.map((value, index) => ["$choice" + index, getInitialData(value)])
			);
			return { $selectedChoice: 0, ...children, ...choices };
		}
		return children;
	} else {
		ensure(schema.items);
		ensure(!isArray(schema.items), "Only supports a single type of items");
		return [getInitialData(schema.items)];
	}
}
