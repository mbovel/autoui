/**
 * UI Model
 */

/** Imports */
import { ComponentType, PropsWithChildren, ReactElement, ReactNode } from "react";
import { InputProps, SectionProps, SelectProps, ArrayProps } from "./Props";

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
	Row: ComponentType<{ children: ReactNode }>;
	Column: ComponentType<{ children: ReactNode }>;
	List: ComponentType<ArrayProps>;
}
