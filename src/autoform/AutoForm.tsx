import { ReactElement, memo } from "react";
import * as React from "react";
import {
	DataProps,
	isStringProps,
	isNumberProps,
	isBooleanProps,
	isObjectProps,
	isArrayProps
} from "../ui/Props";
import { JSONSchema7 } from "json-schema";
import { Components } from "../ui/Components";

export interface JsonSchemaFormProps {
	props: DataProps;
	UI: Components;
	schema?: JSONSchema7 | JSONSchema7[];
}

export const AutoForm = memo(function _AutoForm({
	props,
	UI,
	schema = {}
}: JsonSchemaFormProps): ReactElement | null {
	if (isStringProps(props)) {
		return <UI.TextInput {...props} />;
	} else if (isNumberProps(props)) {
		return <UI.NumberInput {...props} />;
	} else if (isBooleanProps(props)) {
		return <UI.Checkbox {...props} />;
	} else if (isObjectProps(props) || isArrayProps(props)) {
		const children = Object.entries(props.children).map(([key, childProps]) => (
			<AutoForm props={childProps} key={key} schema={schema} UI={UI} />
		));
		if (props.label) return <UI.Section title={props.label}>{children}</UI.Section>;
		else return <>{children}</>;
	}
	throw new Error("");
});
