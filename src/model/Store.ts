import { Dispatcher } from "./Dispatcher";
import { State } from "./State";
import { Action } from "./Action";

export interface Store {
	dispatch: Dispatcher;
	state: State;
	history: StoreHistory;
}

export type StoreHistory = Array<{
	action: Action;
	user: string;
}>;
