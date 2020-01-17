import { JSONType } from "./utils";
import { Action } from "./Action";
import { State } from "./State";
import { useReducer } from "react";
import { stateToProps } from "./stateToProps";
import { DataProps } from "../ui/Props";

export function useDataProps<D extends JSONType, S extends State<D>>(
	initialState: S,
	reducer: (prevState: S, action: Action) => S
): DataProps<D> {
	const [state, dispatch] = useReducer(reducer, initialState);
	return stateToProps(state, dispatch);
}
