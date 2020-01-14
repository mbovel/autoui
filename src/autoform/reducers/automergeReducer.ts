import * as Automerge from "automerge";
import { Action } from "../Action";
import { State, mutateState } from "../State";
import { JSONType } from "../utils";
import { Doc } from "automerge";

export function automergeReducer<D extends JSONType>(
	state: Doc<State<D>>,
	action: Action
): Doc<State<D>> {
	switch (action.type) {
		case "undo":
			return Automerge.undo(state);
		case "redo":
			return Automerge.undo(state);
		default:
			return Automerge.change(state, doc => mutateState(doc, action));
	}
}
