import * as React from "react";
import { Components, SelectProps } from "../Components";
import * as classNames from "classnames";
import { ReactElement, ReactNode } from "react";
import { UIError } from "../Props";

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
		TextInput: ({
			onChange: set,
			onFocus: focus,
			onBlur: blur,
			errors,
			className,
			label,
			data
		}) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="text"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		NumberInput: ({
			onChange: set,
			onFocus: focus,
			onBlur: blur,
			errors,
			className,
			label,
			data
		}) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="number"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(parseFloat(e.target.value)))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Checkbox: ({
			onChange: set,
			onFocus: focus,
			onBlur: blur,
			errors,
			className,
			label,
			data
		}) => (
			<>
				{opts.renderInput(
					<input
						type="checkbox"
						checked={data}
						className={classNames(className, opts.checkboxClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(e.target.checked))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		TextArea: ({
			onChange: set,
			onFocus: focus,
			onBlur: blur,
			errors,
			className,
			label,
			data
		}) => (
			<>
				{opts.renderInput(
					<textarea
						value={data}
						className={classNames(className, opts.textAreaClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		DateInput: ({
			onChange: set,
			onFocus: focus,
			onBlur: blur,
			errors,
			className,
			label,
			data
		}) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="date"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors?.length
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label,
					errorsList(errors)
				)}
			</>
		),
		Select: <D extends string>({
			set,
			focus,
			blur,
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
						onChange={set && (e => set(e.target.value as D))}
						onFocus={focus}
						onBlur={blur}
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
