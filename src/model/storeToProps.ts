import { pathAppend, Primitive, memoize, titleCase } from "./utils";
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
	path: string = "",
	key: string | undefined = undefined
): DataProps {
	console.log("StoreToProps: derive " + path);
	const label = key && titleCase(key);
	const onBlur = () => dispatch({ type: "blur", path });
	const onFocus = () => dispatch({ type: "focus", path });
	if (isPrimitiveState(state)) {
		return {
			data: state.value,
			onChange: (value: Primitive) => dispatch({ type: "set", path, data: value }),
			onBlur,
			onFocus,
			label,
			touched: state.touched,
			_path: path
		};
	} else if (isArrayState(state)) {
		return {
			data: stateToJson(state),
			children: mapValues(state.children, (childState, key) =>
				_storeToProps(childState, dispatch, pathAppend(path, key))
			),
			order: state.order,
			onBlur,
			onFocus,
			label,
			_path: path
		};
	} else {
		return {
			data: stateToJson(state),
			children: mapValues(state.children, (childState, key) =>
				_storeToProps(childState, dispatch, pathAppend(path, key), key)
			),
			onBlur,
			onFocus,
			label,
			_path: path
		};
	}
});
