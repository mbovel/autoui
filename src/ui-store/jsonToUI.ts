import { UIElement, WithoutActions } from "../ui/ui";
import { mapValues, upperFirst, toLower, startCase } from "lodash-es";
import { memoize } from "./memoize";

export interface customJsonUIMapper {
	object?(
		data: object,
		path: string,
		content: { [key: string]: WithoutActions<UIElement> }
	): WithoutActions<UIElement> | undefined;
	string?(data: string, path: string): WithoutActions<UIElement> | undefined;
	number?(data: number, path: string): WithoutActions<UIElement> | undefined;
	boolean?(data: boolean, path: string): WithoutActions<UIElement> | undefined;
}

function titleCase(str: string): string {
	return upperFirst(toLower(startCase(str)));
}

function pathAppend(a: string, b: string) {
	if (a) return a + "." + b;
	else return b;
}

function pathLast(p: string) {
	return p.slice(p.lastIndexOf(".") + 1);
}

export function makeJsonToUI(customMapper: customJsonUIMapper = {}) {
	const jsonToUI = memoize(function(data: any, path: string = ""): WithoutActions<UIElement> {
		const key = pathLast(path);
		if (typeof data === "string") {
			const custom = customMapper.string && customMapper.string(data, path);
			if (custom) return custom;
			const content = { type: "textinput", path, disabled: false, value: data } as const;
			if (!key) return content;
			return { type: "label", content, title: titleCase(key) };
		} else if (typeof data === "number") {
			const custom = customMapper.number && customMapper.number(data, path);
			if (custom) return custom;
			const content = { type: "number", path, value: data } as const;
			if (!key) return content;
			return { type: "label", content, title: titleCase(key) };
		} else if (typeof data === "boolean") {
			const custom = customMapper.boolean && customMapper.boolean(data, path);
			if (custom) return custom;
			const content = { type: "checkbox", path, disabled: false, value: data } as const;
			if (!key) return content;
			return { type: "label", content, title: titleCase(key) };
		} else if (typeof data === "object") {
			const innerContent = mapValues(data, (d, key) => jsonToUI(d, pathAppend(path, key)));
			const custom = customMapper.object && customMapper.object(data, path, innerContent);
			if (custom) return custom;
			const content = { type: "object", content: innerContent } as const;
			if (!key) return { type: "main", content: { type: "form", content } };
			return { type: "section", content, title: titleCase(key) };
		}
		throw new Error("Nop");
	});
	return jsonToUI;
}
