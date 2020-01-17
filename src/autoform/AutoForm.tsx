import { ReactElement, memo } from "react";
import * as React from "react";
import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	isObjectProps
} from "../ui/Props";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { isArray, isObject, isPlainObject } from "lodash-es";
import { isDefined } from "./utils";
import { defaultComponents } from "../ui/default";

const UI = defaultComponents;

export const AutoForm = memo(function _AutoForm(props: DataProps): ReactElement | null {
	if (props.defaultRender) {
		const render = props.defaultRender as (p: typeof props) => ReactElement;
		return render(props);
	}
	if (isStringProps(props)) {
		props.defaultRender = props => <UI.TextInput {...props} />;
		return <UI.TextInput {...props} />;
	} else if (isNumberProps(props)) {
		return <UI.NumberInput {...props} />;
	} else if (isBooleanProps(props)) {
		return <UI.Checkbox {...props} />;
	} else if (isObjectProps(props)) {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<AutoForm {...childProps} key={key} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	} else {
		const { remove, insertAfter } = props;
		return (
			<UI.Section title={props.label as string}>
				{props.order.map(key => (
					<div key={key}>
						{remove && <button onClick={() => remove(key)}>Remove</button>}
						{<AutoForm {...props.children[key]} key={key} />}
					</div>
				))}

				{insertAfter && (
					<button
						onClick={() =>
							insertAfter(props.order.length, { firstname: "", lastname: "" })
						}
					>
						Add
					</button>
				)}
			</UI.Section>
		);
	}
});

export function getSchemaProp<K extends keyof JSONSchema7>(
	schema: JSONSchema7 | JSONSchema7[],
	key: K
): JSONSchema7[K] {
	if (!isArray(schema)) return schema[key];
	for (const s of schema) if (isDefined(s[key])) return s[key];
	return schema[0][key];
}

interface ResolvedSchema {}

export function resolveSchema(schema: JSONSchema7 | JSONSchema7[], data: any): ResolvedSchema {
	const visited = new Set<JSONSchema7>();
	if (isArray(schema)) schema.map(visit);
	else visit(schema);

	const result = {};

	function visit(schema: JSONSchema7Definition | undefined) {
		if (!isObject(schema) || visited.has(schema)) return;
		visited.add(schema);

		schema.allOf?.forEach(visit);
		schema.anyOf?.filter(isApplicable).forEach(visit);
		visit(schema.oneOf?.find(isApplicable));

		if (isApplicable(schema.if)) visit(schema.then);
		else visit(schema.else);

		if (isObject(schema.dependencies)) {
			for (const [key, s] of Object.entries(schema.dependencies)) {
				if (isPlainObject(s) && data.hasOwnProperty(key) && data[key])
					visit(s as JSONSchema7);
			}
		}
	}

	function isApplicable(schema: JSONSchema7Definition | undefined): boolean {
		if (!isObject(schema)) return false;
		return true;
	}

	return result;
}
