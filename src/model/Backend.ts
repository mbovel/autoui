import { State } from "./State";
import { Action } from "./Action";

export interface Backend<S extends State = State> {
	initialState: Readonly<S>;
	dispatch(action: Action): Readonly<S>;
}
