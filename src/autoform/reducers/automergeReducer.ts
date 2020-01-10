import * as Automerge from "automerge";
import { Action } from "../Action";
import { State, set, removeChildState, focus, blur, addChildState } from "../State";

export function automergeReducer(state: State, action: Action): State {
	switch (action.type) {
		case "set":
			return Automerge.change(state, doc => set(doc, action.path, action.value));
		case "add":
			return Automerge.change(state, doc =>
				addChildState(doc, action.path, action.value, action.index)
			);
		case "remove":
			return Automerge.change(state, doc => removeChildState(doc, action.path));
		case "focus":
			return Automerge.change(state, doc => focus(doc, action.path, action.user));
		case "blur":
			return Automerge.change(state, doc => blur(doc, action.path, action.user));
		case "undo":
			return Automerge.undo(state as any) as any; // WTF
		case "redo":
			return Automerge.undo(state as any) as any;
		case "move":
		case "reorder":
			return state;
	}
}
