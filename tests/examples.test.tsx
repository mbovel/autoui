import React from "react";
import {
	NoSchemaDeriver,
	defaultComponents,
	useImmerStore,
	storeToProps,
	storeToCommands,
	stateFromJson,
	Auto
} from "../src";
import ReactDOM from "react-dom";

const initialState = stateFromJson({
	firstname: "",
	lastname: "",
	age: 25,
	isAdult: true
});
const derive = NoSchemaDeriver(defaultComponents);

function App() {
	const store = useImmerStore(initialState);
	const props = derive(storeToProps(store), store.dispatch);
	const commands = storeToCommands(store.state, store.dispatch);

	return (
		<main>
			<form>
				<Auto {...props} />
			</form>
			<button onClick={commands.undo}>Undo</button>
			<button onClick={commands.redo}>Undo</button>
		</main>
	);
}

export function renderApp(container: HTMLElement) {
	ReactDOM.render(<App />, container);
}
