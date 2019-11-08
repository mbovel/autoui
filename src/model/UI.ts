import { ChangeEvent } from "react";

export interface UIText {
	value: string;
	path: string[];
}

export interface UITextMethods {
	onChange(
		value:
			| string
			| Event
			| ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	): void;
}

export interface UITextField extends UIText {
	label?: string;
	disabled: boolean;
}

export interface UITextInput extends UITextField {
	type: "text-input";
}

export interface UITextArea extends UITextField {
	type: "textarea";
}

export interface UIBranch {
	children: {
		[key: string]: UI;
	};
}

export interface UISection extends UIBranch {
	type: "section";
	title?: string;
}

export type UILeaf = UITextInput | UITextArea;
export type UI = UILeaf | UISection;
