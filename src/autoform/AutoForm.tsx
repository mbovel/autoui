import { memo } from "react";
import { Context } from "./Context";

export const AutoForm = memo(function AutoForm(props: Context) {
	return props.mapper(props);
});
