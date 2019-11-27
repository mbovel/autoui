import { UIElement, WithoutActions } from "../ui/ui";
import {
	mapValues,
	upperFirst,
	toLower,
	startCase,
	isString,
	isDate,
	isNumber,
	isBoolean,
	isArray,
	isObject
} from "lodash-es";
import { memoize } from "../utils/memoize";
import { Tree } from "./JsonState";
import { pathLast, pathAppend } from "../utils/path";

type Json = string | number | boolean | Date | JsonObject | JsonArray;
interface JsonObject {
	[x: string]: Json;
}
interface JsonArray extends Array<Json> {}

export interface customJsonUIMapper {
	object?(
		data: object,
		path: string,
		content: { [key: string]: WithoutActions<UIElement> }
	): WithoutActions<UIElement> | undefined;
	value?(
		data: string | number | boolean | Date,
		path: string,
		touched: boolean
	): WithoutActions<UIElement> | undefined;
}

function titleCase(str: string): string {
	return upperFirst(toLower(startCase(str)));
}

const errors: string[] = [];

export function defaultValueUI(
	value: string | number | boolean | Date,
	id: string,
	touched: boolean
): WithoutActions<UIElement> {
	if (isString(value)) return { id, touched, errors, value, type: "textinput" };
	if (isNumber(value)) return { id, touched, errors, value, type: "number" };
	if (isBoolean(value)) return { id, touched, errors, value, type: "checkbox" };
	return { id, touched, errors, value, type: "date" };
}

export const jsonToUI = memoize(function(
	data: Json,
	customMapper: customJsonUIMapper = {},
	touched: Tree<boolean> | undefined,
	path: string = ""
): WithoutActions<UIElement> {
	const key = pathLast(path);
	if (isString(data) || isDate(data) || isNumber(data) || isBoolean(data)) {
		const content =
			(customMapper.value && customMapper.value(data, path, !!touched)) ||
			defaultValueUI(data, path, !!touched);
		if (!key) return content;
		return { type: "label", content, title: titleCase(key) };
	} else if (!isArray(data)) {
		const content = mapValues(data, (childData, key) =>
			jsonToUI(
				childData,
				customMapper,
				isObject(touched) ? touched[key] : touched,
				pathAppend(path, key)
			)
		);
		const custom = customMapper.object && customMapper.object(data, path, content);
		if (custom) return custom;
		if (!key) return { type: "main", content: { type: "form", content } };
		return { type: "section", content, title: titleCase(key) };
	}
	throw new Error("Unsupported value type");
});
