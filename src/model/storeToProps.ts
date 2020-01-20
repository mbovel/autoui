import { pathAppend, Primitive, memoize } from "./utils";
import { DataProps } from "../ui/Props";
import { State, isPrimitiveState, stateToJson, isArrayState } from "./State";
import mapValues from "lodash/mapValues";
import { Dispatcher } from "./Dispatcher";
import { Store } from "./Store";

export function storeToProps(store: Store): DataProps {
	return _storeToProps(store.state, store.dispatch);
}

const _storeToProps = memoize(function(
	state: State,
	dispatch: Dispatcher,
	path: string = ""
): DataProps {
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
			_storeToProps(childState, dispatch, pathAppend(path, key))
		);
		if (isArrayState(state)) {
			return {
				data: stateToJson(state),
				children,
				order: state.order,
				onBlur,
				onFocus
			};
		} else {
			return {
				data: stateToJson(state),
				children,
				onBlur,
				onFocus
			};
		}
	}
});
