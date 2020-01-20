import { useReducer } from "react";
import { State, mutateState } from "../State";
import { Store } from "../Store";
import * as Automerge from "automerge";
import { Action } from "../Action";
import { Doc } from "automerge";

export function useAutomergeStore(initialState: State): Store {
	const [state, dispatch] = useReducer(reducer, initialState, Automerge.from);
	return { state, dispatch, history: [] };
}

export function reducer(prevState: Doc<State>, action: Action) {
	switch (action.type) {
		case "undo":
			return Automerge.undo<State>(prevState);
		case "redo":
			return Automerge.redo<State>(prevState);
		default:
			return Automerge.change(prevState, doc => mutateState(doc, action));
	}
}
