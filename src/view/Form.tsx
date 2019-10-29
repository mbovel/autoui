import { Store } from "../model/Store";
import { Node } from "../model/State";
import { ComponentsRegistry } from "./ComponentsRegistry";
import * as React from "react";
import { ReactNode } from "react";

export function Form(store: Store, components: ComponentsRegistry) {
	const renderNode: (node: Readonly<Node>) => ReactNode = React.memo(node => {
		console.log("render", node);
		if (node.shape === "branch") {
			const children = node.children.map(renderNode);
			return React.createElement(components.branch[node.type], {
				...node,
				store,
				children
			});
		} else {
			return React.createElement(components.leaf[node.type], { ...node, store });
		}
	});
	return <form>{renderNode(store.getState().root)}</form>;
}
