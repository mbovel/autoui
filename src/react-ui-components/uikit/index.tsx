import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";
import { defaultComponents } from "../default/index";
import { AutoChildren } from "../AutoChildren";
import { DefaultInput } from "../default/DefaultInput";
import { DefaultTextarea } from "../default/DefaultTextarea";
import { UIElement } from "../../ui/ui";

function formsControlsClass(ui: UIElement) {
	switch (ui.type) {
		case "checkbox":
			return "uk-form-controls uk-form-controls-text";
	}
	return "uk-form-controls";
}

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
			<AutoChildren content={content} />
		</form>
	),
	section: ({ content, title }) => (
		<section>
			<h1>{title}</h1>
			<AutoChildren content={content} />
		</section>
	),
	textinput: ui => <DefaultInput type="text" className="uk-input" ui={ui} />,
	number: ui => <DefaultInput type="number" className="uk-input" ui={ui} />,
	range: ui => <DefaultInput type="range" className="uk-range" ui={ui} />,
	toggle: ui => <DefaultInput type="checkbox" className="uk-checkbox" ui={ui} />,
	checkbox: ui => <DefaultInput type="checkbox" className="uk-checkbox" ui={ui} />,
	textarea: ui => <DefaultTextarea ui={ui} className="uk-textarea" />,
	date: ui => <DefaultInput type="date" ui={ui} />,
	select: ({ value, id: path, onChange, options }) => (
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
			<div className={formsControlsClass(content)}>
				<Auto ui={content} />
			</div>
		</div>
	)
};
