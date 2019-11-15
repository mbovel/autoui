import { ComponentsMap, Auto } from "../Auto";
import * as React from "react";

export const uikitComponents: ComponentsMap = {
	form: ({ content }) => (
		<form>
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
		<input id={path.join(".")} type="text" value={value} onChange={onChange} />
	),
	textarea: ({ value, path, onChange }) => (
		<textarea className="uk-textarea" id={path.join(".")} value={value} onChange={onChange} />
	),
	label: ({ title, content }) => (
		<label>
			{title}
			<Auto ui={content} />
		</label>
	)
};
