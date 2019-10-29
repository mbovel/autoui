import { History } from "./History";

export interface State {
	root: Node;
	history: History;
}

export interface NodeBase {
	path: string[];
	type: string;
	touched: boolean;
	label?: string;
}

export interface Branch extends NodeBase {
	shape: "branch";
	children: Node[];
}

export interface Leaf extends NodeBase {
	shape: "leaf";
	value: string;
}

export type Node = Branch | Leaf;
