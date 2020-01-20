import { Action } from "./Action";

export type Dispatcher = (action: Action) => void;
