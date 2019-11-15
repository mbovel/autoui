import { UIElement, WithoutActions, ChangeEventArg } from "../ui/ui";
import { mapValues, memoize } from "lodash-es";
import { ChangeEvent } from "react";
import { UIAction } from "./UIAction";
import { Store } from "../store/Store";

export const withActions = memoize(
	(ui: WithoutActions<UIElement>, store: Store<any, UIAction>): UIElement => {
		console.log("withActions", ui);
		switch (ui.type) {
			case "object":
				return {
					...ui,
					content: mapValues(ui.content, value => withActions(value, store))
				};
			case "section":
			case "label":
			case "form":
				return { ...ui, content: withActions(ui.content, store) };
			case "textinput":
			case "textarea":
				return {
					...ui,
					onChange(arg: ChangeEventArg<string>) {
						store.dispatch({ type: "set", path: ui.path, value: getValue(arg) });
					}
				};
			default:
				return ui;
		}
	}
);

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
