export interface UIError {
	path: string;
	message: string;
}

/**
 * Change event handler
 *
 * @typeparam T value type.
 * @category Abstract
 */
export interface InputProps<T = any> {
	value: T;
	errors?: UIError[];
	label?: string;
	title?: string;
	name?: string;
	id?: string;
	className?: string;
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	autofocus?: boolean;

	onChange?: (value: T) => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

export interface FormProps {}

export interface SectionProps {
	title: string;
}

export interface MainProps {}
