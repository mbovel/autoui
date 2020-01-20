import * as React from "react";
import { Components } from "../Components";
import classNames from "classnames";
import { ReactElement, ReactNode } from "react";
import { UIError, SelectProps } from "../Props";

interface Options {
	inputClass?: string;
	textAreaClass?: string;
	selectClass?: string;
	checkboxClass?: string;
	errorInputClass: string;
	errorClass: string;
	renderInput: (
		inputEl: ReactElement,
		label: string | undefined,
		errors: ReactNode
	) => ReactElement;
}
export function makeFormComponents(
	opts: Options
): Pick<
	Components,
	"TextInput" | "NumberInput" | "Checkbox" | "TextArea" | "DateInput" | "Select"
> {
	return {
		TextInput: ({ onChange, onFocus, onBlur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="text"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
						onFocus={onFocus}
						onBlur={onBlur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		NumberInput: ({ onChange: set, onFocus, onBlur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="number"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(parseFloat(e.target.value)))}
						onFocus={onFocus}
						onBlur={onBlur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Checkbox: ({ onChange, onFocus, onBlur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						type="checkbox"
						checked={data}
						className={classNames(className, opts.checkboxClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.checked))}
						onFocus={onFocus}
						onBlur={onBlur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		TextArea: ({ onChange, onFocus, onBlur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<textarea
						value={data}
						className={classNames(className, opts.textAreaClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
						onFocus={onFocus}
						onBlur={onBlur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		DateInput: ({ onChange, onFocus, onBlur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="date"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
						onFocus={onFocus}
						onBlur={onBlur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Select: <D extends string>({
			onChange,
			onFocus,
			onBlur,
			errors,
			className,
			label,
			options,
			data
		}: SelectProps<D>) => (
			<>
				{opts.renderInput(
					<select
						value={data}
						className={classNames(className, opts.selectClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value as D))}
						onFocus={onFocus}
						onBlur={onBlur}
					>
						{Object.entries(options).map(([key, label]) => (
							<option key={key} value={key}>
								{label as string}
							</option>
						))}
					</select>,
					label,
					errorsList(errors)
				)}
			</>
		)
	};
	function errorsList(errors: UIError[] | undefined) {
		return (
			errors &&
			errors.map((it: UIError) => (
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
		renderInput: (inputEl, label, errors) => (
			<p>
				{label && <label className="uk-form-label">{label}</label>} {inputEl}
				{errors}
			</p>
		)
	}),
	Row: ({ children }) => {
		return <div style={{ display: "flex" }}>{children}</div>;
	},
	Column: ({ children }) => {
		return <div>{children}</div>;
	},
	Section: ({ title, children }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	)
};
