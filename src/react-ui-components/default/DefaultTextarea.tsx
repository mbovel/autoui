import * as React from "react";
import { UIValue } from "../../ui/ui";
import { DefaultErrorsList } from "./DefaultErrorsList";
import { pick } from "lodash-es";

export function DefaultTextarea({ ui }: { ui: UIValue<any>; className?: string }) {
	return (
		<>
			<textarea {...pick(ui, ["value", "onChange", "onBlur", "id"])} />
			<DefaultErrorsList ui={ui} />
		</>
	);
}
