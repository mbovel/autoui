import * as Automerge from "automerge";
import { Action } from "./Action";
import { State } from "./State";

export function automergeReducer(state: State, action: Action): State {
	switch (action.type) {
		case "set":
			return Automerge.change(state, doc => State.set(doc, action.path, action.value));
		case "add":
			return Automerge.change(state, doc =>
				State.add(doc, action.path, action.value, action.index)
			);
		case "remove":
			return Automerge.change(state, doc => State.remove(doc, action.path));
		case "focus":
			return Automerge.change(state, doc => State.focus(doc, action.path, action.user));
		case "blur":
			return Automerge.change(state, doc => State.blur(doc, action.path, action.user));
		case "undo":
			return Automerge.undo(state as any) as any; // WTF
		case "redo":
			return Automerge.undo(state as any) as any;
		case "move":
		case "reorder":
			return state;
	}
}
