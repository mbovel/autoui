import { isPlainObject } from "lodash-es";

export interface Error {
	path: string;
	message: string;
}

export type ErrorList = Error[] | undefined;

export function mergeErrors(a: ErrorList, b: ErrorList): ErrorList {
	return a && b ? a.concat(b) : a || b;
}

export function filterErrorsByPath(feedback: ErrorList, path: string) {
	const filtered = feedback?.filter(it => it.path.startsWith(path));
	return filtered?.length === 0 ? undefined : filtered;
}

export function isError(feedback: ErrorList | Error): feedback is Error {
	return isPlainObject(feedback);
}
