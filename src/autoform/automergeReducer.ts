import * as Automerge from "automerge";
import { set } from "lodash-es";
import { Action } from "./Action";

export function automergeReducer<S>(state: Automerge.Doc<S>, action: Action): Automerge.Doc<S> {
	switch (action.type) {
		case "set":
			return Automerge.change(state, (doc: Automerge.Proxy<S>) => {
				set(doc as Readonly<S>, "data." + action.id, action.value);
			});
		case "touch":
			return Automerge.change(state, (doc: Automerge.Proxy<S>) => {
				set(doc as Readonly<S>, "touched." + action.id, true);
			});
		case "undo":
			return Automerge.undo(state);
		case "redo":
			return Automerge.undo(state);
	}
}
