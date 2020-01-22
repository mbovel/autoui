import { pathAppend, Primitive, memoize, pathLast, titleCase, JSONType } from "./utils";
import { DataProps, DataPropsOf } from "../ui/Props";
import { State, isPrimitiveState, stateToJson, isArrayState } from "./State";
import mapValues from "lodash/mapValues";
import { Dispatcher } from "./Dispatcher";
import { Store, StoreOf } from "./Store";

export function storeToProps(store: Store): DataProps {
	return _storeToProps(store.state, store.dispatch);
}

const _storeToProps = memoize(function(
	state: State,
	dispatch: Dispatcher,
	path: string = ""
): DataProps {
	console.log("StoreToProps: derive " + path);
	const label = titleCase(pathLast(path));
	const onBlur = () => dispatch({ type: "blur", path });
	const onFocus = () => dispatch({ type: "focus", path });
	if (isPrimitiveState(state)) {
		return {
			data: state.value,
			onChange: (value: Primitive) => dispatch({ type: "set", path, data: value }),
			onBlur,
			onFocus,
			label,
			_path: path
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
				onFocus,
				label,
				_path: path
			};
		} else {
			return {
				data: stateToJson(state),
				children,
				onBlur,
				onFocus,
				label,
				_path: path
			};
		}
	}
});

export const typedStoreToProps: <D extends JSONType>(
	store: StoreOf<D>
) => DataPropsOf<D> = _storeToProps as any;
