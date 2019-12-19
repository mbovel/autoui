import { ReactElement } from "react";
import { Context } from "./Context";
import { isDefined } from "./utils";

export type FullMapper = (context: Context) => ReactElement | null;
export type Mapper = (context: Context) => ReactElement | null | undefined;

export function mergeMappers(...mappers: Mapper[]): FullMapper {
	return (...args: Parameters<Mapper>) => {
		for (const mapper of mappers) {
			const result = mapper(...args);
			if (isDefined(result)) return result;
		}
		throw new Error("No function returned a result");
	};
}
