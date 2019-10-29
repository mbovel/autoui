import { memoize1 } from "./utils";
import { Node } from "./State";

export const nodeFromJSON = memoize1(
	<T>(data: T, path: string[] = [], touched: boolean = false): Readonly<Node> => {
		if (typeof data === "string") {
			return {
				shape: "leaf",
				path,
				type: typeof data,
				touched,
				value: data
			};
		} else if (typeof data === "object") {
			if (Array.isArray(data)) {
				throw new Error("Arrays not supported yet.");
			} else {
				return {
					shape: "branch",
					path,
					type: typeof data,
					touched,
					children: Object.keys(data).map(key =>
						nodeFromJSON(key, path.concat([key]), touched)
					)
				};
			}
		}
		throw new Error("Not supported yet.");
	}
);
