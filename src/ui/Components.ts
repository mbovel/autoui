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
	TextInput: ComponentType<InputProps<string>>;
	TextArea: ComponentType<InputProps<string>>;
	NumberInput: ComponentType<InputProps<number>>;
	Select: ComponentType<InputProps<string> & { options: { [key: string]: string } }>;
	Checkbox: ComponentType<InputProps<boolean>>;
	DateInput: ComponentType<InputProps<string>>;
	Section: ComponentType<SectionProps>;
	Main: ComponentType<MainProps>;
	Form: ComponentType<FormProps>;
}
