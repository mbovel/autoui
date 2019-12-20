import * as React from "react";
import { Components } from "../Components";
import { inputWithFeedback, selectWithFeedback, textareaWithFeedback } from "../helpers";

export const defaultComponents: Components = {
	Main: ({ children }) => <main>{children}</main>,
	Form: ({ children }) => <form>{children}</form>,
	Section: ({ children, title }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	),
	TextInput: props => inputWithFeedback("text", props),
	Number: props => inputWithFeedback("number", props),
	Checkbox: props => inputWithFeedback("checkbox", props),
	TextArea: props => textareaWithFeedback(props),
	Date: props => inputWithFeedback("date", props),
	Select: props => selectWithFeedback(props),
	Label: ({ title, children }) => (
		<p>
			<label>
				{title} {children}
			</label>
		</p>
	)
};
