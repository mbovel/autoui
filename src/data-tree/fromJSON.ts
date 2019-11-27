import { mapValues, isDate, isArray, isString, isNumber, isBoolean } from "lodash-es";
import { memoize } from "../utils/memoize";
import { DataTree } from "./DataTree";
import * as uuidv4 from "uuid/v4";
import { pathAppend } from "../utils/path";

type Json = string | number | boolean | Date | JsonObject | JsonArray;
interface JsonObject {
	[x: string]: Json;
}
interface JsonArray extends Array<Json> {}

export const fromJSON = memoize(function(value: Json, path: string): DataTree {
	if (isString(value) || isNumber(value) || isBoolean(value) || isDate(value)) {
		return {
			touched: false,
			value: value
		};
	} else {
		const childrenByKey = isArray(value)
			? Object.fromEntries(value.map(child => [uuidv4(), child]))
			: value;
		return {
			touched: false,
			childrenOrder: Object.keys(childrenByKey),
			children: mapValues(childrenByKey, (child, key) =>
				fromJSON(child, pathAppend(path, key))
			)
		};
	}
});
