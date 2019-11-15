import { UIElement, WithoutActions } from "../ui/ui";
import { last, mapValues, concat, memoize } from "lodash-es";

type Path = string[];

interface customJsonUIMap {
	object?(
		data: object,
		path: Path,
		content: { [key: string]: WithoutActions<UIElement> }
	): WithoutActions<UIElement> | undefined;
	string?(data: string, path: Path): WithoutActions<UIElement> | undefined;
}

export function makeJsonToUI(customMap: customJsonUIMap = {}) {
	const jsonToUI = memoize(function(data: any, path: Path = []): WithoutActions<UIElement> {
		console.log("jsonToUI", data);
		const title = last(path);
		if (typeof data === "string") {
			const custom = customMap.string && customMap.string(data, path);
			if (custom) return custom;
			const content = { type: "textinput", path, disabled: false, value: data } as const;
			if (!title) return content;
			return { type: "label", content, title };
		} else if (typeof data === "object") {
			const innerContent = mapValues(data, (value, key) =>
				jsonToUI(value, concat(path, key))
			);
			const custom = customMap.object && customMap.object(data, path, innerContent);
			if (custom) return custom;
			const content = { type: "object", content: innerContent } as const;
			if (!title) return { type: "form", content };
			return { type: "section", content, title };
		}
		throw new Error("Nop");
	});
	return jsonToUI;
}
