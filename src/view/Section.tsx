import * as React from "react";
import { UISection } from "../model/UI";
import { WithMethods } from "../model/withMethods";
import { Auto } from "./Auto";

export const Section = ({ children, title }: WithMethods<UISection>) => {
	return (
		<section className="uk-section">
			<h1>{title}</h1>
			{Object.entries(children).map(([key, ui]) => (
				<Auto key={key} {...(ui as any)} />
			))}
		</section>
	);
};
