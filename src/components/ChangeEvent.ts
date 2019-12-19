import { ChangeEvent as ReactChangeEvent } from "react";

/**
 * Argument type for a [[ChangeEventHandler]]
 *
 * The argument of a [[ChangeEventHandler]] might either directly be a value of the right type, or an Event or
 * `React.ChangeEvent` whose target has a string `value` property.
 *
 * @typeparam T type of changed value.
 */
export type ChangeEventArg<T> =
	| T
	| Event
	| ReactChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export function isEvent<T>(
	arg: ChangeEventArg<T>
): arg is Event | ReactChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
	return (arg as any).target !== undefined;
}

/**
 * Change event handler
 *
 * @typeparam T type of changed value.
 */
export type ChangeEventHandler<T> = (valueOrEvent: ChangeEventArg<T>) => void;

export function getEventValue<T>(arg: ChangeEventArg<T>, parse: (text: string) => T): T {
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
