import * as React from "react";
import { UIValue } from "../../ui/ui";
import { DefaultErrorsList } from "./DefaultErrorsList";
import { pick } from "lodash-es";

export function DefaultInput({
	ui,
	type,
	className
}: {
	ui: UIValue<any>;
	type: string;
	className?: string;
}) {
	return (
		<>
			<input
				type={type}
				className={
					className +
					(ui.touched && ui.errors.length > 0 ? " is-invalid uk-form-danger" : "")
				}
				{...pick(ui, ["value", "onChange", "onBlur", "id"])}
			/>
			<DefaultErrorsList ui={ui} />
		</>
	);
}
