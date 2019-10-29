import { BranchComponent } from "./ComponentsRegistry";
import * as React from "react";

export const Section: BranchComponent = ({ children, label }) => {
	return (
		<section className="uk-section">
			<h1>{label}</h1>
			{children}
		</section>
	);
};
