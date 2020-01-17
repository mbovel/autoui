import { Action } from "./Action";
import { titleCase, pathLast, pathAppend, Primitive, JSONType, memoize } from "./utils";
import { DataProps } from "../ui/Props";
import { State, isPrimitiveState, toJSON, isArrayState } from "./State";
import { mapValues } from "lodash-es";

type Dispatch = (action: Action) => void;

export const stateToProps = memoize(_stateToProps, new WeakMap());

function _stateToProps<D extends JSONType>(
	state: State<D>,
	dispatch: Dispatch,
	path?: string
): DataProps<D>;
function _stateToProps(state: State, dispatch: Dispatch, path?: string): DataProps;
function _stateToProps(state: State, dispatch: Dispatch, path: string = ""): DataProps {
	const commonProps = {
		label: titleCase(pathLast(path)),
		onBlur: () => dispatch({ type: "blur", path }),
		onFocus: () => dispatch({ type: "focus", path })
	};

	if (isPrimitiveState(state)) {
		return {
			data: state.value,
			onChange: (value: Primitive) => dispatch({ type: "set", path, data: value }),
			...commonProps
		};
	} else {
		const children = mapValues(state.children, (childState, key) =>
			stateToProps(childState, dispatch, pathAppend(path, key))
		);
		if (isArrayState(state)) {
			return {
				data: toJSON(state),
				children,
				order: state.order,
				...commonProps
			};
		} else {
			return {
				data: toJSON(state),
				children,
				...commonProps
			};
		}
	}
}
