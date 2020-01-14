import { JSONType } from "./utils";
import { Action } from "./Action";
import { State } from "./State";
import { useReducer } from "react";
import { getDataProps } from "./getDataProps";

export function useDataProps<D extends JSONType>(
	initialState: State<D>,
	reducer: (prevState: State<D>, action: Action) => State<D>
) {
	const [state, dispatch] = useReducer(reducer, initialState);
	return getDataProps(state.data, state.touched, state.active, dispatch);
}
