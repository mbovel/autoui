import { Action } from "./Action";
import { pathAppend } from "./utils";
import { DerivedData, getChildDerivedData } from "./DerivedData";
import { State, getChildState } from "./State";

export interface AutoFormProps {
	path: string;
	state: State;
	derived: DerivedData;
	dispatch: (action: Action) => void;
	user: string;
}

export function getChildAutoFormProps(props: AutoFormProps, key: string): AutoFormProps {
	return {
		...props,
		path: pathAppend(props.path, key),
		state: getChildState(props.state, key),
		derived: getChildDerivedData(props.derived, key)
	};
}
