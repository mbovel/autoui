import * as React from "react";
import { Components } from "../Components";
import { ErrorList } from "../Errors";
import * as classNames from "classnames";
import { ReactElement } from "react";

interface Options {
	inputClass?: string;
	textAreaClass?: string;
	selectClass?: string;
	checkboxClass?: string;
	errorInputClass: string;
	errorClass: string;
	renderInput: (inputEl: ReactElement, label?: string) => ReactElement;
}
export function makeFormComponents(
	opts: Options
): Pick<
	Components,
	"TextInput" | "NumberInput" | "Checkbox" | "TextArea" | "DateInput" | "Select"
> {
	return {
		TextInput: ({ onChange, errors, className, label, ...otherProps }) => (
			<>
				{opts.renderInput(
					<input
						{...otherProps}
						type="text"
						onChange={onChange && (e => onChange(e.target.value))}
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		NumberInput: ({ onChange, errors, className, label, ...otherProps }) => (
			<>
				{opts.renderInput(
					<input
						{...otherProps}
						type="number"
						onChange={onChange && (e => onChange(parseFloat(e.target.value)))}
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		Checkbox: ({ onChange, errors, className, label, value, ...otherProps }) => (
			<>
				{opts.renderInput(
					<input
						{...otherProps}
						type="checkbox"
						checked={value}
						onChange={onChange && (e => onChange(e.target.checked))}
						className={classNames(className, opts.checkboxClass, {
							[opts.errorInputClass]: errors
						})}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		TextArea: ({ onChange, errors, className, label, ...otherProps }) => (
			<>
				{opts.renderInput(
					<textarea
						{...otherProps}
						onChange={onChange && (e => onChange(e.target.value))}
						className={classNames(className, opts.textAreaClass, {
							[opts.errorInputClass]: errors
						})}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		DateInput: ({ onChange, errors, className, label, value, ...otherProps }) => (
			<>
				{opts.renderInput(
					<input
						{...otherProps}
						type="date"
						onChange={onChange && (e => onChange(e.target.value))}
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		Select: ({ onChange, errors, className, label, options, ...otherProps }) => (
			<>
				{opts.renderInput(
					<select
						{...otherProps}
						onChange={onChange && (e => onChange(e.target.value))}
						className={classNames(className, opts.selectClass, {
							[opts.errorInputClass]: errors
						})}
					>
						{Object.entries(options).map(([key, value]) => (
							<option key={key} value={key}>
								{value}
							</option>
						))}
					</select>,
					label
				)}
			</>
		)
	};
	function errorsList(errors: ErrorList) {
		return (
			errors &&
			errors.map(it => (
				<small key={it.message} className={opts.errorClass}>
					{it.message}
				</small>
			))
		);
	}
}

export const defaultComponents: Components = {
	...makeFormComponents({
		errorClass: "error",
		errorInputClass: "error",
		renderInput: (inputEl, label) => (
			<p>
				{label && <label className="uk-form-label">{label}</label>}
				<div className={classNames("uk-form-controls", { "uk-form-controls-text": false })}>
					{inputEl}
				</div>
			</p>
		)
	}),
	Main: ({ children }) => <main>{children}</main>,
	Section: ({ title, children }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	),
	Form: ({ children }) => <form>{children}</form>
};
