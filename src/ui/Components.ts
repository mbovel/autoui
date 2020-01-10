/**
 * UI Model
 */

/** Imports */
import { ComponentType } from "react";
import { InputProps, SectionProps, MainProps, FormProps } from "./Props";

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
	TextInput: ComponentType<InputProps<string>>;

	/*
	 * Text area
	 *
	 * @category Concrete
	 */
	TextArea: ComponentType<InputProps<string>>;
	NumberInput: ComponentType<InputProps<number>>;
	Select: ComponentType<InputProps<string> & { options: { [key: string]: string } }>;
	Checkbox: ComponentType<InputProps<boolean>>;
	DateInput: ComponentType<InputProps<string>>;
	Section: ComponentType<SectionProps>;
	Main: ComponentType<MainProps>;
	Form: ComponentType<FormProps>;
}
