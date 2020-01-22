import {
	defaultComponents,
	useImmerStore,
	storeToCommands,
	stateFromJson,
	Auto,
	typedStoreToProps
} from "../../../src";
import ReactDOM from "react-dom";
import React from "react";

const UI = defaultComponents;

const initialState = stateFromJson({
	firstname: "",
	lastname: "",
	age: 25,
	isAdult: true as boolean
});

function App() {
	const store = useImmerStore(initialState);
	const props = typedStoreToProps(store);
	const commands = storeToCommands(store);

	return (
		<main>
			<form>
				<UI.TextInput {...props.children.firstname} />
			</form>
			<button onClick={commands.undo}>Undo</button>
			<button onClick={commands.redo}>Undo</button>
		</main>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
