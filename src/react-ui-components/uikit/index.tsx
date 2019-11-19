import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";
import { defaultComponents } from "../default";

export const uikitComponents: ComponentsMap = {
	...defaultComponents,
	main: ({ content }) => (
		<div className="uk-section">
			<div className="uk-container uk-container-small">
				<Auto ui={content} />
			</div>
		</div>
	),
	form: ({ content }) => (
		<form className="uk-form-horizontal uk-margin-large">
			<Auto ui={content} />
		</form>
	),
	section: ({ content, title }) => (
		<section>
			<h1>{title}</h1>
			<Auto ui={content} />
		</section>
	),
	object: ({ content }) => (
		<>
			{Object.entries(content).map(([key, ui]) => (
				<Auto key={key} ui={ui} />
			))}
		</>
	),
	textinput: ({ value, path, onChange }) => (
		<input className="uk-input" id={path} type="text" value={value} onChange={onChange} />
	),
	textarea: ({ value, path, onChange }) => (
		<textarea className="uk-textarea" id={path} value={value} onChange={onChange} />
	),
	number: ({ value, path, onChange }) => (
		<input id={path} className="uk-input" type="number" value={value} onChange={onChange} />
	),
	range: ({ value, path, onChange }) => (
		<input id={path} className="uk-range" type="range" value={value} onChange={onChange} />
	),
	toggle: ({ value, path, onChange }) => (
		<input
			id={path}
			className="uk-checkbox"
			type="checkbox"
			value={value.toString()}
			onChange={onChange}
		/>
	),
	checkbox: ({ value, path, onChange }) => (
		<input
			className="uk-checkbox"
			id={path}
			type="checkbox"
			value={value.toString()}
			onChange={onChange}
			style={{ marginTop: 5 }}
		/>
	),
	select: ({ value, path, onChange, options }) => (
		<select className="uk-select" value={value} onChange={onChange}>
			{Object.entries(options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	),
	label: ({ title, content }) => (
		<div className="uk-margin">
			<label className="uk-form-label">{title}</label>
			<div className="uk-form-controls">
				<Auto ui={content} />
			</div>
		</div>
	)
};
