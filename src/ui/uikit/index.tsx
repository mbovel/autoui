import { Components } from "../Components";
import { makeFormComponents } from "../default";
import * as React from "react";
import classNames from "classnames";

export const uikitComponents: Components = {
	...makeFormComponents({
		inputClass: "uk-input",
		textAreaClass: "uk-textarea",
		checkboxClass: "uk-checkbox",
		selectClass: "uk-select",
		errorClass: "uk-text-danger",
		errorInputClass: "uk-form-danger",
		renderInput: (inputEl, label, errors) => (
			<div className="uk-form-stacked uk-margin">
				{label && <label className="uk-form-label">{label}</label>}
				<div className={classNames("uk-form-controls", { "uk-form-controls-text": false })}>
					{inputEl}
				</div>
				{errors}
			</div>
		)
	}),
	Row: ({ children }) => {
		return <div style={{ display: "flex", margin: "-5px" }}>{children}</div>;
	},
	Column: ({ children }) => {
		return <div style={{ flexBasis: "0", flexGrow: 1, margin: "5px" }}>{children}</div>;
	},
	Section: ({ title, children }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	)
};
