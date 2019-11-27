import * as Automerge from "automerge";
import { set } from "lodash-es";
import { UIAction } from "../ui-store/UIAction";
import { SimpleStore } from "../store/SimpleStore";
import { JsonState, Json } from "./JsonState";

export function AutomergeStore<S extends JsonState<D>, D extends Json>(
	initialState: Automerge.Doc<S>
): SimpleStore<S, UIAction> {
	return new SimpleStore(
		reduce as (state: Readonly<S>, action: UIAction) => Readonly<S>,
		initialState as Readonly<S>
	);
}

function reduce<S>(state: Automerge.Doc<S>, action: UIAction): Automerge.Doc<S> {
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
