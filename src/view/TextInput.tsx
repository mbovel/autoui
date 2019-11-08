import * as React from "react";
import { UITextInput } from "../model/UI";
import { WithMethods } from "../model/withMethods";

export const TextInput = ({ value, path, label, onChange }: WithMethods<UITextInput>) => {
	const id = path.join(".");
	return (
		<div className="uk-margin">
			<label className="uk-form-label" htmlFor={id}>
				{label}
			</label>
			<div className="uk-form-controls">
				<input className="uk-input" id={id} type="text" value={value} onChange={onChange} />
			</div>
		</div>
	);
};
