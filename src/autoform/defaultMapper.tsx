import { pathLast, Primitive, isPrimitive } from "./utils";
import * as React from "react";
import { getEventValue } from "../components/ChangeEvent";
import { identity, isString, isNumber, isBoolean, isNull, isDate, isObject } from "lodash-es";
import { ValueProps } from "../components/Components";
import { Mapper } from "./Mapper";
import { Context, childContext } from "./Context";
import { AutoForm } from "./AutoForm";

export const defaultMapper: Mapper = ctx => {
	const { UI, path, data } = ctx;
	const label = pathLast(path);
	if (isPrimitive(data)) {
		let field = null;
		if (isString(ctx.data)) field = <UI.textinput {...valueProps(ctx)} />;
		else if (isNumber(data)) field = <UI.number {...valueProps(ctx)} />;
		else if (isBoolean(data)) field = <UI.checkbox {...valueProps(ctx)} />;
		else if (isDate(data)) field = <UI.date {...valueProps(ctx)} />;
		return label ? <UI.label title={label}>{field}</UI.label> : field;
	} else if (isObject(data)) {
		const children = Object.keys(data).map(key => (
			<AutoForm {...childContext(ctx, key)} key={key} />
		));
		return label ? (
			<UI.section title={label}>{children}</UI.section>
		) : (
			<UI.main>
				<UI.form>{children}</UI.form>
			</UI.main>
		);
	}
	throw new Error("Data type not supported yet.");
};

export function valueProps({ data, dispatch, touched, feedback, path }: Context): ValueProps<any> {
	const parse = parseByType(data);
	return {
		value: data,
		feedback: !!touched ? feedback : undefined,
		touched: !!touched,
		id: path,
		onChange: arg => dispatch({ type: "set", id: path, value: getEventValue(arg, parse) }),
		onBlur: () => dispatch({ type: "touch", id: path })
	};
}

export function parseByType<T extends Primitive>(value: T): (text: string) => T {
	if (isString(value)) return identity;
	else if (isNumber(value)) return parseInt as any;
	else if (isBoolean(value)) return (s: string) => !!s as any;
	else if (isNull(value)) return () => null as any;
	else return (s: string) => new Date(s) as any;
}
