import { UIChildren } from "../ui/ui";
import { memo } from "react";
import { Auto } from "./Auto";
import * as React from "react";

export const AutoChildren = memo(function AutoChildren({ content }: { content: UIChildren }) {
	return (
		<>
			{Object.entries(content).map(([key, ui]) => (
				<Auto key={key} ui={ui} />
			))}
		</>
	);
});
