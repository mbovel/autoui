import { Components } from "../Components";
import { makeFormComponents } from "../default";
import * as React from "react";
import classNames from "classnames";
import { Auto } from "../Auto";
import isFunction from "lodash/isFunction";

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
	),
	List: ({ remove, add, children, label }) => (
		<section className="uk-card uk-card-default uk-card-body  uk-margin">
			<h1>{label}</h1>
			{Object.entries(children).map(([key, childProps]) => (
				<>
					<Auto {...(childProps as any)} key={key} />
					{remove?.[key] && (
						<div className="uk-flex uk-flex-right">
							<button
								onClick={remove?.[key]}
								className="uk-button uk-button-danger uk-margin-left"
								type="button"
							>
								Remove
							</button>
						</div>
					)}
					<hr />
				</>
			))}
			{add && isFunction(add) && (
				<div className="uk-flex uk-flex-right">
					<button
						onClick={add}
						className="uk-button uk-margin-left uk-button-primary"
						type="button"
					>
						Add
					</button>
				</div>
			)}
			{add && !isFunction(add) && (
				<div className="uk-flex uk-flex-right">
					{Object.entries(add).map(([text, f]) => (
						<button
							onClick={f}
							className="uk-button uk-margin-left uk-button-primary"
							type="button"
						>
							{text}
						</button>
					))}
				</div>
			)}
		</section>
	)
};
