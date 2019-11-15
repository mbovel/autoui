import { UIElement, WithoutActions } from "../ui/ui";
import { last, mapValues, concat, memoize, upperFirst, toLower, startCase } from "lodash-es";

type Path = string[];

export interface customJsonUIMapper {
	object?(
		data: object,
		path: Path,
		content: { [key: string]: WithoutActions<UIElement> }
	): WithoutActions<UIElement> | undefined;
	string?(data: string, path: Path): WithoutActions<UIElement> | undefined;
	number?(data: number, path: Path): WithoutActions<UIElement> | undefined;
	boolean?(data: boolean, path: Path): WithoutActions<UIElement> | undefined;
}

function titleCase(str: string): string {
	return upperFirst(toLower(startCase(str)));
}

export function makeJsonToUI(customMapper: customJsonUIMapper = {}) {
	const jsonToUI = memoize(function(data: any, path: Path = []): WithoutActions<UIElement> {
		console.log("jsonToUI", data);
		const key = last(path);
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
			const innerContent = mapValues(data, (value, key) =>
				jsonToUI(value, concat(path, key))
			);
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
