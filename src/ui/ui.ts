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

export function isEvent<T>(
	arg: ChangeEventArg<T>
): arg is Event | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
	return (arg as any).target !== undefined;
}

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
	value: T;
	/**
	 * On change handler
	 */
	onChange: ChangeEventHandler<T>;
	/**
	 * Path
	 */
	id: string;

	onBlur: () => void;
	touched: boolean;

	errors: string[];
}

/*
 * Text input
 *
 * @category Concrete
 */
export interface UITextInput extends UIValue<string> {
	type: "textinput";
}

/**
 * Text area
 *
 * @category Concrete
 */
export interface UITextArea extends UIValue<string> {
	type: "textarea";
}

export interface UISelect extends UIValue<string> {
	type: "select";
	options: { [key: string]: string };
}

export interface UICheckbox extends UIValue<boolean> {
	type: "checkbox";
}

export interface UIToggle extends UIValue<boolean> {
	type: "toggle";
}

export interface UINumber extends UIValue<number> {
	type: "number";
}

export interface UIRange extends UIValue<number> {
	type: "range";
}

export interface UIDate extends UIValue<Date> {
	type: "date";
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

export interface UIForm extends UIGroup {
	type: "form";
}

export interface UISection extends UIGroup {
	type: "section";
	/**
	 * Section's title
	 */
	title: string;
}

export interface UIWrapper {
	content: UIElement;
}

export interface UILabel extends UIWrapper {
	type: "label";
	title: string;
}

export interface UIMain extends UIWrapper {
	type: "main";
}

/**
 * Any concrete UI type
 */
export type UIElement =
	| UITextInput
	| UITextArea
	| UISection
	| UIForm
	| UILabel
	| UIMain
	| UINumber
	| UIRange
	| UISelect
	| UICheckbox
	| UIToggle
	| UIDate;

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
		: K
}[keyof T];

/**
 * Filter a UIElement to keep only non-event properties.
 */
export type WithoutActions<T> = T extends UIElement
	? {
			[P in NonActionPropertyNames<T>]: T[P] extends UIElement
				? WithoutActions<T[P]>
				: T[P] extends UIChildren
				? { [K in keyof T[P]]: WithoutActions<T[P][K]> }
				: T[P]
	  }
	: T;
