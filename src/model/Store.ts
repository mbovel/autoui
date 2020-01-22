import { Dispatcher } from "./Dispatcher";
import { State, StateOf } from "./State";
import { Action } from "./Action";
import { JSONType } from "./utils";

export interface Store {
	dispatch: Dispatcher;
	state: State;
	history: StoreHistory;
}

export interface StoreOf<D extends JSONType> {
	dispatch: Dispatcher;
	state: StateOf<D>;
	history: StoreHistory;
}

export type StoreHistory = Array<{
	action: Action;
	user: string;
}>;
