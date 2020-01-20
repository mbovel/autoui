import { pathAppend, Primitive, memoize } from "./utils";
import { DataProps } from "../ui/Props";
import { State, isPrimitiveState, toJSON, isArrayState } from "./State";
import mapValues from "lodash/mapValues";
import { Dispatcher } from "./Dispatcher";

export const storeToProps = memoize(_storeToProps, new WeakMap());

function _storeToProps(state: State, dispatch: Dispatcher, path: string = ""): DataProps {
	const onBlur = () => dispatch({ type: "blur", path });
	const onFocus = () => dispatch({ type: "focus", path });
	if (isPrimitiveState(state)) {
		return {
			data: state.value,
			onChange: (value: Primitive) => dispatch({ type: "set", path, data: value }),
			onBlur,
			onFocus
		};
	} else {
		const children = mapValues(state.children, (childState, key) =>
			storeToProps(childState, dispatch, pathAppend(path, key))
		);
		if (isArrayState(state)) {
			return {
				data: toJSON(state),
				children,
				order: state.order,
				onBlur,
				onFocus
			};
		} else {
			return {
				data: toJSON(state),
				children,
				onBlur,
				onFocus
			};
		}
	}
}
