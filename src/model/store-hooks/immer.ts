import { useReducer, useRef, Ref } from "react";
import { State, mutateState } from "../State";
import { Store } from "../Store";
import { Action } from "../Action";
import { produce, Patch } from "immer";

export function useImmerStore(initialState: State): Store {
	const changes: Ref<Patch[]> = useRef([]);
	const inverseChanges: Ref<Patch[]> = useRef([]);

	const [state, dispatch] = useReducer((prevState: State, action: Action) => {
		switch (action.type) {
			case "undo":
				return prevState;
			case "redo":
				return prevState;
			default:
				return produce(
					prevState,
					(draft: State) => mutateState(draft, action),
					(patches, inversePatches) => {
						changes.current!.push(...patches);
						inverseChanges.current!.push(...inversePatches);
					}
				);
		}
	}, initialState);

	return { state, dispatch, history: [] };
}
