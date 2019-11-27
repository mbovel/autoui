import * as React from "react";
import { UIValue } from "../../ui/ui";

export function DefaultErrorsList({ ui }: { ui: UIValue<any> }) {
	if (ui.touched && ui.errors.length > 0)
		return <small className="error uk-text-danger invalid-feedback">{ui.errors[0]}</small>;
	return null;
}
