import { JSONType } from "./utils";
import { StateOf } from "./State";
import { useReducer } from "react";
import { storeToProps } from "./storeToProps";
import { DataPropsOf } from "../ui/Props";
import { Reducer } from "./Reducer";
import { Deriver } from "./Deriver";
import { Commands } from "./Commands";
import { storeToCommands } from "./storeToCommands";

export function useModel<D extends JSONType>(
	initialState: StateOf<D>,
	reducer: Reducer,
	...derivers: Deriver[]
): [DataPropsOf<D>, Commands] {
	const [state, dispatch] = useReducer(reducer, undefined, () => initialState);
	const baseProps = storeToProps(state, dispatch);
	const derivedProps = derivers.reduce((props, derive) => derive(props, dispatch), baseProps);
	const commands = storeToCommands(state, dispatch);
	return [derivedProps as DataPropsOf<D>, commands];
}
