import { useReducer, useRef } from "react";
import { State, mutateState, StateOf } from "../State";
import { Store, StoreOf } from "../Store";
import { Action } from "../Action";
import { produce, Patch, applyPatches } from "immer";
import { JSONType } from "../utils";

type ImmerLog = Array<{
	patches: Patch[];
	inversePatches: Patch[];
	action: Action;
	user: string;
}>;

export function useImmerStore<D extends JSONType>(initialState: StateOf<D>): StoreOf<D>;
export function useImmerStore(initialState: State): Store;
export function useImmerStore(initialState: State): Store {
	const history: ImmerLog = useRef([]).current;
	const future: ImmerLog = useRef([]).current;

	const [state, dispatch] = useReducer((prevState: State, action: Action) => {
		switch (action.type) {
			case "undo":
				const previous = history.pop();
				if (!previous) return prevState;
				future.push(previous);
				return applyPatches(prevState, previous.inversePatches);
			case "redo":
				const next = future.pop();
				if (!next) return prevState;
				history.push(next);
				return applyPatches(prevState, next.patches);
			default:
				return produce(
					prevState,
					(draft: State) => mutateState(draft, action),
					(patches, inversePatches) => {
						if (
							action.type === "set" ||
							action.type === "insertAfter" ||
							action.type === "remove" ||
							action.type === "sort"
						) {
							history.push({
								patches,
								inversePatches,
								user: "me",
								action
							});
						}
						future.length = 0;
					}
				);
		}
	}, initialState);

	return { state, dispatch, history };
}
