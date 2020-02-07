import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	ObjectProps,
	isObjectProps,
	PrimitiveProps
} from "../../ui/Props";
import { Components } from "../../ui/Components";
import { Deriver } from "../Deriver";
import * as React from "react";
import { Auto } from "../../ui/Auto";
import mapValues from "lodash/mapValues";
import {
	memoize,
	JSONType,
	isDefined,
	ensure,
	getUniqueKey,
	JSONObject,
	titleCase
} from "../utils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import isNull from "lodash/isNull";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import { Dispatcher } from "../Dispatcher";
import keys from "lodash/keys";
import { stateFromJson } from "../..";
import { ReactElement } from "react";
import zipObject from "lodash/zipObject";

export function JsonSchemaDeriver(UI: Components, rootSchema: JSONSchema7): Deriver {
	function renderObject(props: ObjectProps) {
		return (
			<>
				{Object.entries(props.children).map(([key, childProps]) => (
					<Auto {...childProps} key={key} />
				))}
			</>
		);
	}

	function makeRenderChoice(choices: { [key: string]: string }) {
		return function render(props: ObjectProps): ReactElement {
			return (
				<>
					{Object.entries(props.children).map(([key, childProps]) =>
						key === "$selectedChoice" ? (
							<UI.Select {...(childProps as any)} options={choices} />
						) : (
							<Auto {...childProps} key={key} />
						)
					)}
				</>
			);
		};
	}

	console.log("JsonSchemaDeriver: constructs");

	const derive = memoize(function(
		props: DataProps,
		dispatch: Dispatcher,
		schema: JSONSchema7Definition = rootSchema
	): DataProps {
		ensure(!isBoolean(schema));

		const path = props._path!;
		console.log("NoSchemaDeriver: derive " + props._path);
		const label = schema.title ?? props.label;

		if (isStringProps(props)) {
			let errors = undefined;
			if (props.touched && schema.format && !new RegExp(schema.format).test(props.data)) {
				errors = [
					{
						message: "Does not match format :'(",
						path
					}
				];
			}
			let _render = undefined;
			if (schema.enum) {
				const options = zipObject(schema.enum as any, schema.enum as any) as {
					[key: string]: string;
				};
				_render = (props: PrimitiveProps<string>) => (
					<UI.Select options={options} {...(props as any)} />
				);
			}
			return { ...props, _component: UI.TextInput, label, errors, _render };
		} else if (isNumberProps(props)) {
			return { ...props, _component: UI.NumberInput, label };
		} else if (isBooleanProps(props)) {
			return { ...props, _component: UI.Checkbox, label };
		} else if (isObjectProps(props)) {
			const children: { [key: string]: DataProps } = {};
			const choices: { [key: string]: string } = {};
			let isChoice = false;
			for (const [key, childProps] of Object.entries(props.children)) {
				if (key === "$selectedChoice") {
					children[key] = childProps;
					isChoice = true;
					continue;
				}
				if (key.startsWith("$choice")) {
					const choiceIndex = key.slice(7);
					const subSchema = schema.oneOf![parseInt(choiceIndex)];
					choices[choiceIndex] = (subSchema as any).title ?? "Choice " + choiceIndex;
					choices[choiceIndex] = titleCase(choices[choiceIndex]);

					if (key !== "$choice" + props.data.$selectedChoice) continue;
					children[key] = derive(childProps, dispatch, subSchema);
					continue;
				}
				children[key] = derive(childProps, dispatch, schema.properties![key]);
			}
			return {
				...props,
				_render: isChoice ? makeRenderChoice(choices) : renderObject,
				children,
				label
			};
		} else {
			const subSchema = schema.items;
			ensure(
				isDefined(subSchema) && !isBoolean(subSchema) && !isArray(subSchema),
				"Only supports a single schema as items"
			);
			let add = undefined;
			const existingKeys = keys(props.children);
			const data = getInitialData(subSchema);
			if (subSchema.oneOf) {
				add = Object.fromEntries(
					subSchema.oneOf.map((value, index) => {
						ensure(!isBoolean(value));
						const name = "Add " + (value.title ?? index.toString());
						const subAdd = () =>
							dispatch({
								type: "insertAfter",
								path,
								key: getUniqueKey(existingKeys),
								data: stateFromJson({
									...(data as JSONObject),
									$selectedChoice: index
								})
							});
						return [name, subAdd];
					})
				);
			} else {
				add = () =>
					dispatch({
						type: "insertAfter",
						path,
						key: getUniqueKey(existingKeys),
						data: stateFromJson(data)
					});
			}
			return {
				...props,
				_component: UI.List,
				remove: mapValues(props.children, (_, key) => () =>
					dispatch({ type: "remove", path, key })
				),
				add,
				children: mapValues(props.children, child => derive(child, dispatch, subSchema)),
				label
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
			return { $selectedChoice: "0", ...children, ...choices };
		}
		return children;
	} else {
		ensure(schema.items && !isArray(schema.items), "Only supports a single schema as items");
		return [getInitialData(schema.items)];
	}
}
