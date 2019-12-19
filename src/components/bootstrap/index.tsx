import * as React from "react";
import { defaultComponents } from "../default/index";
import { Components } from "../Components";

export const bootstrapComponents: Components = {
	...defaultComponents,
	main: ({ children }) => <div className="container-s my-5">{children}</div>
};
