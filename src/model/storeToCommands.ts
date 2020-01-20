import { Dispatcher } from "./Dispatcher";
import { Commands } from "./Commands";
import { State } from "./State";

export function storeToCommands(state: State, dispatch: Dispatcher): Commands {
	return {
		undo: () => dispatch({ type: "undo" }),
		redo: () => dispatch({ type: "redo" })
	};
}
