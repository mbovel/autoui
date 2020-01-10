import { Components } from "../Components";
import { makeFormComponents } from "../default";
import * as React from "react";
import * as classNames from "classnames";

export const uikitComponents: Components = {
	...makeFormComponents({
		inputClass: "uk-input",
		textAreaClass: "uk-textarea",
		checkboxClass: "uk-input",
		selectClass: "uk-select",
		errorClass: "uk-form-danger",
		errorInputClass: "uk-text-danger",
		renderInput: (inputEl, label) => (
			<div className="uk-margin">
				{label && <label className="uk-form-label">{label}</label>}
				<div className={classNames("uk-form-controls", { "uk-form-controls-text": false })}>
					{inputEl}
				</div>
			</div>
		)
	}),
	Main: ({ children }) => (
		<div className="uk-section">
			<div className="uk-container uk-container-small">{children}</div>
		</div>
	),
	Section: ({ title, children }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	),
	Form: ({ children }) => <form className="uk-form-horizontal uk-margin-large">{children}</form>
};
