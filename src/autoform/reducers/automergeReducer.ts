import * as Automerge from "automerge";
import { Action } from "../Action";
import { State, applyAction } from "../State";

export function automergeReducer(state: State, action: Action): State {
	switch (action.type) {
		case "undo":
			return Automerge.undo(state);
		case "redo":
			return Automerge.undo(state);
		default:
			return Automerge.change(state, doc => applyAction(doc, action));
	}
}
