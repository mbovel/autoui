import * as Automerge from "automerge";
import { set } from "lodash-es";
import { UIAction } from "./UIAction";
import { SimpleStore } from "../store/SimpleStore";

export function AutomergeStore<S>(initialState: Automerge.Doc<S>): SimpleStore<S, UIAction> {
	return new SimpleStore(
		reduce as (state: Readonly<S>, action: UIAction) => Readonly<S>,
		initialState as Readonly<S>
	);
}

function reduce<S>(state: Automerge.Doc<S>, action: UIAction): Automerge.Doc<S> {
	switch (action.type) {
		case "set":
			return Automerge.change(state, (doc: Automerge.Proxy<S>) => {
				set(doc as Readonly<S>, action.path, action.value);
			});
		case "undo":
			return Automerge.undo(state);
		case "redo":
			return Automerge.undo(state);
	}
}
