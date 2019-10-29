import { LeafComponent } from "./ComponentsRegistry";
import * as React from "react";

export const TextInput: LeafComponent = ({ value, path, store, label }) => {
	const id = path.join(".");
	return (
		<div className="uk-margin">
			<label className="uk-form-label" htmlFor={id}>
				{label}
			</label>
			<div className="uk-form-controls">
				<input
					className="uk-input"
					id={id}
					type="text"
					value={value}
					onChange={e =>
						store.dispatch({ type: "set", value: e.currentTarget.value, path })
					}
				/>
			</div>
		</div>
	);
};
