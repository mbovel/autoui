/**
 * UI Model
 */

/** Imports */
import { ComponentType, PropsWithChildren, ReactElement } from "react";
import { InputProps, SectionProps } from "./Props";

export interface SelectProps<D extends string = any> extends InputProps<D> {
	options: { [key in D]: string };
}

/*
 * UI Components
 *
 * @category Concrete
 */
export interface Components {
	TextInput: ComponentType<InputProps<string>>;
	TextArea: ComponentType<InputProps<string>>;
	NumberInput: ComponentType<InputProps<number>>;
	Select: <D extends string>(
		props: PropsWithChildren<SelectProps<D>>,
		context?: any
	) => ReactElement | null;
	Checkbox: ComponentType<InputProps<boolean>>;
	DateInput: ComponentType<InputProps<string>>;
	Section: ComponentType<SectionProps>;
}
