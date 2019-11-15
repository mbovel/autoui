/**
 * UI Model
 */

/** Imports */
import * as React from "react";

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
	| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

/**
 * Change event handler
 *
 * @typeparam T type of changed value.
 */
export type ChangeEventHandler<T> = (valueOrEvent: ChangeEventArg<T>) => void;

/**
 * Change event handler
 *
 * @typeparam T value type.
 * @category Abstract
 */
export interface UIValue<T> {
	/**
	 * Value
	 */
	value: string;
	/**
	 * On change handler
	 */
	onChange: ChangeEventHandler<T>;
	/**
	 * Path
	 */
	path: string[];
}

/**
 * Text field
 *
 * @category Abstract
 */
export interface UITextField extends UIValue<string> {
	disabled: boolean;
}

/**
 * Text input
 *
 * @category Concrete
 */
export interface UITextInput extends UITextField {
	type: "textinput";
}

/**
 * Text area
 *
 * @category Concrete
 */
export interface UITextArea extends UITextField {
	type: "textarea";
}

export interface UIChildren {
	[key: string]: UIElement;
}

/**
 * Group
 */
export interface UIGroup {
	content: UIChildren;
}

export interface UIObject extends UIGroup {
	type: "object";
}

export interface UIWrapper {
	content: UIElement;
}

export interface UILabel extends UIWrapper {
	type: "label";
	title: string;
}

export interface UIForm extends UIWrapper {
	type: "form";
}

/**
 * Section
 *
 * @category Concrete
 */
export interface UISection extends UIWrapper {
	type: "section";
	/**
	 * Section's title
	 */
	title: string;
}

/**
 * Any concrete UI type
 */
export type UIElement = UITextInput | UITextArea | UISection | UIObject | UIForm | UILabel;
export type UIType = UIElement["type"];

export type TypeFromDiscriminatedAttribute<
	T extends object,
	K extends keyof T,
	V extends T[K]
> = T extends object ? (T[K] extends V ? T : never) : never;

export type UIElementFromType<T extends UIType> = TypeFromDiscriminatedAttribute<
	UIElement,
	"type",
	T
>;

type NonActionPropertyNames<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any
		? ReturnType<T[K]> extends void
			? never
			: K
		: K;
}[keyof T];

/**
 * Filter a UIElement to keep only non-event properties.
 */
export type WithoutActions<T> = T extends UIElement | UIChildren
	? { [P in NonActionPropertyNames<T>]: WithoutActions<T[P]> }
	: T;
