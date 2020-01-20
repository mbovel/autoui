import { DataProps } from "./Props";
import { ReactElement, memo, createElement } from "react";

export const Auto = memo(function Auto(props: DataProps): ReactElement {
	if (props._render) return props._render(props as any);
	if (props._component) return createElement(props._component as any, props as any);
	throw new Error("");
});
