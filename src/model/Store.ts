import { Dispatcher } from "./Dispatcher";
import { State } from "./State";

export interface Store {
	dispatch: Dispatcher;
	state: State;
	history: StoreHistory;
}

export type StoreHistory = Array<{
	message: string;
}>;
