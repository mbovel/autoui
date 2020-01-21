import * as React from "react";
import { Components } from "../Components";
import classNames from "classnames";
import { ReactElement, ReactNode } from "react";
import { UIError, SelectProps } from "../Props";
import pick from "lodash/pick";

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

const inputProps = [
	"title",
	"name",
	"id",
	"className",
	"disabled",
	"readonly",
	"required",
	"autofocus",
	"onFocus",
	"onBlur"
] as const;
export function makeFormComponents(
	opts: Options
): Pick<
	Components,
	"TextInput" | "NumberInput" | "Checkbox" | "TextArea" | "DateInput" | "Select"
> {
	return {
		TextInput: ({ onChange, errors, className, label, data, ...props }) => (
			<>
				{opts.renderInput(
					<input
						{...pick(props, inputProps)}
						value={data}
						type="text"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		NumberInput: ({ onChange: set, errors, className, label, data, ...props }) => (
			<>
				{opts.renderInput(
					<input
						{...pick(props, inputProps)}
						value={data}
						type="number"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(parseFloat(e.target.value)))}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Checkbox: ({ onChange, errors, className, label, data, ...props }) => (
			<>
				{opts.renderInput(
					<input
						{...pick(props, inputProps)}
						type="checkbox"
						checked={data}
						className={classNames(className, opts.checkboxClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.checked))}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		TextArea: ({ onChange, errors, className, label, data, ...props }) => (
			<>
				{opts.renderInput(
					<textarea
						{...pick(props, inputProps)}
						value={data}
						className={classNames(className, opts.textAreaClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		DateInput: ({ onChange, errors, className, label, data, ...props }) => (
			<>
				{opts.renderInput(
					<input
						{...pick(props, inputProps)}
						value={data}
						type="date"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value))}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Select: <D extends string>({
			onChange,
			errors,
			className,
			label,
			options,
			data,
			...props
		}: SelectProps<D>) => (
			<>
				{opts.renderInput(
					<select
						{...pick(props, inputProps)}
						value={data}
						className={classNames(className, opts.selectClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={onChange && (e => onChange(e.target.value as D))}
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
