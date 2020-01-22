import { Commands } from "./Commands";
import { Store } from "./Store";

export function storeToCommands(store: Store): Commands {
	return {
		undo: () => store.dispatch({ type: "undo" }),
		redo: () => store.dispatch({ type: "redo" })
	};
}
