import { Components, ValueProps } from "../Components";
import { defaultComponents } from "../default";
import * as React from "react";
import { FeedbackClasses } from "../Feedback";
import { inputWithFeedback, textareaWithFeedback, selectWithFeedback } from "../helpers";
import { Primitive } from "../../autoform/utils";
import { ReactNode } from "react";

const feedbackClasses: FeedbackClasses = {
	error: "uk-text-danger",
	warning: "uk-text-warning",
	info: "uk-text-primary",
	ok: "uk-text-success",
	none: ""
};

const formElementClasses: FeedbackClasses = {
	error: "uk-form-danger",
	warning: "",
	info: "",
	ok: "uk-form-success",
	none: ""
};

function ukInputWithFeedback<V extends Primitive>(type: string, props: ValueProps<V>) {
	return inputWithFeedback(type, props, "uk-input", feedbackClasses, formElementClasses);
}

function formsControlsClass(children: ReactNode) {
	if (children === uikitComponents.Checkbox) return "uk-form-controls uk-form-controls-text";
	return "uk-form-controls";
}

export const uikitComponents: Components = {
	...defaultComponents,
	Main: ({ children }) => (
		<div className="uk-section">
			<div className="uk-container uk-container-small">{children}</div>
		</div>
	),
	Form: ({ children }) => <form className="uk-form-horizontal uk-margin-large">{children}</form>,
	TextInput: props => ukInputWithFeedback("text", props),
	Number: props => ukInputWithFeedback("number", props),
	Checkbox: props => ukInputWithFeedback("checkbox", props),
	TextArea: props => textareaWithFeedback(props, "uk-textarea", formElementClasses),
	Date: props => ukInputWithFeedback("date", props),
	Select: props => selectWithFeedback(props, "uk-select", formElementClasses),
	Label: ({ title, children }) => (
		<div className="uk-margin">
			<label className="uk-form-label">{title}</label>
			<div className={formsControlsClass(children)}>{children}</div>
		</div>
	)
};
