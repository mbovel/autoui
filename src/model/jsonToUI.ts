import { UI } from "./UI";
import { last, mapValues, concat } from "lodash-es";

type Path = string[];

interface customJsonUIMap {
	object?(data: object, path: Path, children: { [key: string]: UI }): UI;
	string?(data: string, path: Path): UI;
}

export function jsonToUI(custom: customJsonUIMap = {}) {
	return function auto(data: any, path: Path = []): UI {
		const label = last(path);
		if (typeof data === "string") {
			return (
				(custom.string && custom.string(data, path)) || {
					type: "text-input",
					path,
					label,
					value: data,
					disabled: false
				}
			);
		} else if (typeof data === "object") {
			const children = mapValues(data, (value, key) => auto(value, concat(path, key)));
			return (
				(custom.object && custom.object(data, path, children)) || {
					type: "section",
					title: label,
					children
				}
			);
		}
		throw new Error("");
	};
}
