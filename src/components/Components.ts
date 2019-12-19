/**
 * UI Model
 */

/** Imports */
import { ChangeEventHandler } from "./ChangeEvent";
import { ComponentType } from "react";
import { Feedback } from "./Feedback";

/**
 * Change event handler
 *
 * @typeparam T value type.
 * @category Abstract
 */
export interface ValueProps<T> {
	value: T;
	onChange: ChangeEventHandler<T>;
	id: string;
	onBlur: () => void;
	touched: boolean;
	feedback: Feedback;
}

/*
 * Text input
 *
 * @category Concrete
 */
export interface TextInputProps extends ValueProps<string> {}

/**
 * Text area
 *
 * @category Concrete
 */
export interface TextAreaProps extends ValueProps<string> {}

export interface SelectProps extends ValueProps<string> {
	options: { [key: string]: string };
}

export interface CheckboxProps extends ValueProps<boolean> {}

export interface ToggleProps extends ValueProps<boolean> {}

export interface NumberProps extends ValueProps<number> {}

export interface RangeProps extends ValueProps<number> {}

export interface DateProps extends ValueProps<Date> {}

export interface FormProps {}

export interface SectionProps {
	title: string;
}

export interface LabelProps {
	title: string;
}

export interface MainProps {}

/*
 * UI Components
 *
 * @category Concrete
 */
export interface Components {
	/*
	 * Text input
	 *
	 * @category Concrete
	 */
	textinput: ComponentType<ValueProps<string>>;

	/*
	 * Text area
	 *
	 * @category Concrete
	 */
	textarea: ComponentType<ValueProps<string>>;
	select: ComponentType<ValueProps<string> & { options: { [key: string]: string } }>;
	number: ComponentType<ValueProps<number>>;
	checkbox: ComponentType<ValueProps<boolean>>;
	date: ComponentType<ValueProps<Date>>;
	label: ComponentType<LabelProps>;
	section: ComponentType<SectionProps>;
	main: ComponentType<MainProps>;
	form: ComponentType<FormProps>;
}
