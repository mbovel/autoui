import * as React from "react";
import { Components, SelectProps } from "../Components";
import * as classNames from "classnames";
import { ReactElement } from "react";
import { UIError } from "../Props";

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
		TextInput: ({ set, focus, blur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="text"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		NumberInput: ({ set, focus, blur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="number"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(parseFloat(e.target.value)))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		Checkbox: ({ set, focus, blur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						type="checkbox"
						checked={data}
						className={classNames(className, opts.checkboxClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(e.target.checked))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		TextArea: ({ set, focus, blur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<textarea
						value={data}
						className={classNames(className, opts.textAreaClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label
				)}
				{errorsList(errors)}
			</>
		),
		DateInput: ({ set, focus, blur, errors, className, label, data }) => (
			<>
				{opts.renderInput(
					<input
						value={data}
						type="date"
						className={classNames(className, opts.inputClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(e.target.value))}
						onFocus={focus}
						onBlur={blur}
					/>,
					label
				)}
				{errorsList(errors)}
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
						className={classNames(className, opts.selectClass, {
							[opts.errorInputClass]: errors
						})}
						onChange={set && (e => set(e.target.value as D))}
						onFocus={focus}
						onBlur={blur}
					>
						{Object.entries(options).map(([key, value]) => (
							<option key={key} value={value as string}>
								{data}
							</option>
						))}
					</select>,
					label
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
		renderInput: (inputEl, label) => (
			<p>
				{label && <label className="uk-form-label">{label}</label>}
				<div className={classNames("uk-form-controls", { "uk-form-controls-text": false })}>
					{inputEl}
				</div>
			</p>
		)
	}),
	Section: ({ title, children }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	)
};
