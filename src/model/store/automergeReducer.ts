import * as Automerge from "automerge";
import { Action } from "../Action";
import { mutateState, State } from "../State";
import { Doc } from "automerge";

export function automergeReducer(state: Doc<State>, action: Action): Doc<State> {
	switch (action.type) {
		case "undo":
			return Automerge.undo<State>(state);
		case "redo":
			return Automerge.redo<State>(state);
		default:
			return Automerge.change(state, doc => mutateState(doc, action));
	}
}
