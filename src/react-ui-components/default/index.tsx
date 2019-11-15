import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";

export const defaultComponents: ComponentsMap = {
	main: ({ content }) => (
		<main>
			<Auto ui={content} />
		</main>
	),
	form: ({ content }) => (
		<form>
			<Auto ui={content} />
		</form>
	),
	section: function Section({ content, title }) {
		return (
			<section>
				<h1>{title}</h1>
				<Auto ui={content} />
			</section>
		);
	},
	object: ({ content }) => (
		<>
			{Object.entries(content).map(([key, ui]) => (
				<Auto key={key} ui={ui} />
			))}
		</>
	),
	textinput: ({ value, path, onChange }) => (
		<input id={path.join(".")} type="text" value={value} onChange={onChange} />
	),
	textarea: ({ value, path, onChange }) => (
		<textarea id={path.join(".")} value={value} onChange={onChange} />
	),
	number: ({ value, path, onChange }) => (
		<input id={path.join(".")} type="number" value={value} onChange={onChange} />
	),
	range: ({ value, path, onChange }) => (
		<input id={path.join(".")} type="range" value={value} onChange={onChange} />
	),
	toggle: ({ value, path, onChange }) => (
		<input id={path.join(".")} type="checkbox" value={value.toString()} onChange={onChange} />
	),
	checkbox: ({ value, path, onChange }) => (
		<input id={path.join(".")} type="checkbox" value={value.toString()} onChange={onChange} />
	),
	select: ({ value, path, onChange, options }) => (
		<select value={value} onChange={onChange}>
			{Object.entries(options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	),
	label: ({ title, content }) => (
		<label>
			{title}
			<Auto ui={content} />
		</label>
	)
};
