import { UIElement, WithoutActions, ChangeEventArg } from "../ui/ui";
import { mapValues } from "lodash-es";
import { ChangeEvent } from "react";
import { UIAction } from "./UIAction";
import { Store } from "../store/Store";
import { memoize } from "./memoize";

export const withActions = memoize(function(
	ui: WithoutActions<UIElement>,
	store: Store<any, UIAction>
): UIElement {
	switch (ui.type) {
		case "object":
			return {
				...ui,
				content: mapValues(ui.content, value => withActions(value, store))
			};
		case "section":
		case "label":
		case "form":
		case "main":
			return { ...ui, content: withActions(ui.content, store) };
		case "textinput":
		case "textarea":
		case "select":
			return {
				...ui,
				onChange(arg: ChangeEventArg<string>) {
					store.dispatch({ type: "set", path: ui.path, value: getValue(arg) });
				}
			};
		case "toggle":
		case "checkbox":
			return {
				...ui,
				onChange(arg: ChangeEventArg<boolean>) {
					store.dispatch({ type: "set", path: ui.path, value: !!getValue(arg) });
				}
			};
		case "number":
		case "range":
			return {
				...ui,
				onChange(arg: ChangeEventArg<number>) {
					store.dispatch({
						type: "set",
						path: ui.path,
						value: parseInt(getValue(arg) as any)
					});
				}
			};
		default:
			return ui;
	}
});

function getValue<T>(
	valueOrEvent:
		| string
		| number
		| boolean
		| Event
		| ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) {
	if (typeof valueOrEvent === "string") return valueOrEvent;
	if (typeof valueOrEvent === "number") return valueOrEvent;
	if (typeof valueOrEvent === "boolean") return valueOrEvent;
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
