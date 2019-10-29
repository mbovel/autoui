import { Backend } from "../Backend";
import { State } from "../State";
import { nodeFromJSON } from "../nodeFromJSON";
import { Action } from "../Action";
import { Doc } from "automerge";
import * as Automerge from "automerge";
import { last } from "../utils";

export function automergeBackend<T>(root: Doc<T>): Backend {
	return {
		initialState: {
			root: nodeFromJSON(root),
			history: []
		},
		dispatch(action: Action): Readonly<State> {
			switch (action.type) {
				case "set":
					root = Automerge.change(root, doc => {
						let current: any = doc;
						for (const key in action.path.slice(0, -1)) current = current[key];
						current[last(action.path)] = action.value;
						return doc;
					});
					break;
				case "undo":
					root = Automerge.undo(root);
					break;
				case "redo":
					root = Automerge.undo(root);
					break;
			}
			return {
				root: nodeFromJSON(root),
				history: []
			};
		}
	};
}
