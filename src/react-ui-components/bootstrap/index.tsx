import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";
import { defaultComponents } from "../default/index";
import { DefaultInput } from "../default/DefaultInput";
import { DefaultTextarea } from "../default/DefaultTextarea";

export const bootstrapComponents: ComponentsMap = {
	...defaultComponents,
	main: ({ content }) => (
		<div className="container-sm my-5">
			<div className="uk-container uk-container-small">
				<Auto ui={content} />
			</div>
		</div>
	),
	textinput: ui => <DefaultInput type="text" className="form-control" ui={ui} />,
	number: ui => <DefaultInput type="number" className="form-control" ui={ui} />,
	range: ui => <DefaultInput type="range" className="form-control" ui={ui} />,
	toggle: ui => <DefaultInput type="checkbox" className="form-control" ui={ui} />,
	checkbox: ui => <DefaultInput type="checkbox" className="form-control" ui={ui} />,
	textarea: ui => <DefaultTextarea ui={ui} className="form-control" />,
	select: ({ value, id: path, onChange, options }) => (
		<select className="custom-select" value={value} onChange={onChange}>
			{Object.entries(options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	),
	label: ({ title, content }) => (
		<div className="form-group">
			<label className="uk-form-label">{title}</label>
			<Auto ui={content} />
		</div>
	)
};
