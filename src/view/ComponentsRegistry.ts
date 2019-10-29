import * as React from "react";
import { NodeBase } from "../model/State";
import { ReactNode } from "react";
import { Store } from "../model/Store";

export interface BranchProps extends NodeBase {
	children: ReactNode[];
	store: Store;
}

export type BranchComponent = React.ComponentType<BranchProps>;

export interface LeafProps extends NodeBase {
	value: string;
	store: Store;
}

export type LeafComponent = React.ComponentType<LeafProps>;

export type NodeComponent = BranchComponent | LeafComponent;

export interface ComponentsRegistry {
	branch: {
		[type: string]: BranchComponent;
	};
	leaf: {
		[type: string]: LeafComponent;
	};
}
