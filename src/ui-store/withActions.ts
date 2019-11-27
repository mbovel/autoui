import { UIElement, WithoutActions, ChangeEventArg, isEvent } from "../ui/ui";
import { mapValues, identity } from "lodash-es";
import { UIAction } from "./UIAction";
import { Store } from "../store/Store";
import { memoize } from "../utils/memoize";

export const withActions = memoize(function(
	ui: WithoutActions<UIElement>,
	store: Store<any, UIAction>
): UIElement {
	switch (ui.type) {
		case "section":
		case "form":
			return {
				...ui,
				content: mapValues(ui.content, value => withActions(value, store))
			};
		case "label":
		case "main":
			return { ...ui, content: withActions(ui.content, store) };
		case "textinput":
		case "textarea":
		case "select":
			return {
				...ui,
				onChange(arg: ChangeEventArg<string>) {
					store.dispatch({ type: "set", id: ui.id, value: getValue(arg, identity) });
				},
				onBlur() {
					store.dispatch({ type: "touch", id: ui.id });
				}
			};
		case "toggle":
		case "checkbox":
			return {
				...ui,
				onChange(arg: ChangeEventArg<boolean>) {
					store.dispatch({ type: "set", id: ui.id, value: getValue(arg, s => !!s) });
				},
				onBlur() {
					store.dispatch({ type: "touch", id: ui.id });
				}
			};
		case "number":
		case "range":
			return {
				...ui,
				onChange(arg: ChangeEventArg<number>) {
					store.dispatch({
						type: "set",
						id: ui.id,
						value: getValue(arg, parseInt)
					});
				},
				onBlur() {
					store.dispatch({ type: "touch", id: ui.id });
				}
			};
		case "date":
			return {
				...ui,
				onChange(arg: ChangeEventArg<Date>) {
					store.dispatch({
						type: "set",
						id: ui.id,
						value: getValue(arg, s => new Date(s))
					});
				},
				onBlur() {
					store.dispatch({ type: "touch", id: ui.id });
				}
			};
		default:
			return ui;
	}
});

function getValue<T>(arg: ChangeEventArg<T>, parse: (text: string) => T): T {
	if (!isEvent(arg)) return arg;

	const target = arg.target;
	if (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement
	) {
		return parse(target.value);
	}
	throw new Error("Event's target should be an input or a textarea.");
}
