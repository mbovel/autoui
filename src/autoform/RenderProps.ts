import { InputProps } from "../ui/Props";
import { ReactElement } from "react";

export interface BranchRenderProps {
	child(path: string): ReactElement;
	children: ReactElement[];
}

export type RenderProps =
	| InputProps<string>
	| InputProps<boolean>
	| InputProps<number>
	| BranchRenderProps;
