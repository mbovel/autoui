import { State } from "./State";
import { Action } from "./Action";

export type Reducer = (prevState: State, action: Action) => State;
