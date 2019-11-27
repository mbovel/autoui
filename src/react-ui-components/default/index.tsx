import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";
import { DefaultInput } from "./DefaultInput";
import { DefaultTextarea } from "./DefaultTextarea";
import { AutoChildren } from "../AutoChildren";

export const defaultComponents: ComponentsMap = {
	main: ({ content }) => (
		<main>
			<Auto ui={content} />
		</main>
	),
	form: ({ content }) => (
		<form>
			<AutoChildren content={content} />
		</form>
	),
	section: function Section({ content, title }) {
		return (
			<section>
				<h1>{title}</h1>
				<AutoChildren content={content} />
			</section>
		);
	},
	textinput: ui => <DefaultInput type="text" ui={ui} />,
	number: ui => <DefaultInput type="number" ui={ui} />,
	range: ui => <DefaultInput type="range" ui={ui} />,
	toggle: ui => <DefaultInput type="checkbox" ui={ui} />,
	checkbox: ui => <DefaultInput type="checkbox" ui={ui} />,
	textarea: ui => <DefaultTextarea ui={ui} />,
	date: ui => <DefaultInput type="date" ui={ui} />,
	select: ({ value, id: path, onChange, options }) => (
		<select value={value} onChange={onChange}>
			{Object.entries(options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	),
	label: ({ title, content }) => (
		<p>
			<label>
				{title} <Auto ui={content} />
			</label>
		</p>
	)
};
