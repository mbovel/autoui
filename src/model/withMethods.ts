import { UI, UIBranch, UIText, UITextMethods } from "./UI";
import { mapValues } from "lodash-es";
import { ChangeEvent } from "react";
import { UIAction } from "./UIAction";
import { Store } from "./Store";

export type WithMethods<S extends UI> = S extends UIBranch
	? S & { children: { [K in keyof S["children"]]: WithMethods<S["children"][K]> } }
	: S extends UIText
	? S & UITextMethods
	: never;

//type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
//type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export function withMethods(ui: UI, store: Store<any, UIAction>): WithMethods<UI> {
	if (ui.type === "section") {
		return {
			...ui,
			children: mapValues(ui.children, value => withMethods(value, store))
		};
	} else if (ui.type === "text-input" || ui.type === "textarea") {
		return {
			...ui,
			onChange(
				value:
					| string
					| Event
					| ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
			) {
				store.dispatch({ type: "set", path: ui.path, value: getValue(value) });
			}
		};
	}
	throw new Error("");
}

function getValue(
	valueOrEvent:
		| string
		| Event
		| ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) {
	if (typeof valueOrEvent === "string") return valueOrEvent;
	const target = valueOrEvent.target;
	if (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement
	) {
		return target.value;
	}
	throw new Error("Event's target should be an input or a textarea.");
}
