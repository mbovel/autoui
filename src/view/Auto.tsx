import { UI } from "../model/UI";
import React = require("react");
import { TextInput } from "./TextInput";
import { Section } from "./Section";
import { TextArea } from "./TextArea";
import { WithMethods } from "../model/withMethods";

const componentsMap = {
	"text-input": TextInput,
	textarea: TextArea,
	section: Section
};

export const Auto = React.memo((ui: WithMethods<UI>) => {
	return React.createElement(componentsMap[ui.type] as any, ui);
});
