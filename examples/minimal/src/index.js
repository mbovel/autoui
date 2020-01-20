import {
	NoSchemaDeriver,
	defaultComponents,
	useImmerStore,
	storeToProps,
	storeToCommands,
	stateFromJson,
	Auto
} from "autoui";
import ReactDOM from "react-dom";
import React from "react"

const initialState = stateFromJson({
	firstname: "",
	lastname: "",
	age: 25,
	isAdult: true,
})
const derive = NoSchemaDeriver(defaultComponents)

function App() {
	const store = useImmerStore(initialState)
	const props = derive(storeToProps(store), store.dispatch)
	const commands = storeToCommands(store.state, store.dispatch)

	return <main>
		<form><Auto {...props} /></form>
		<button onClick={commands.undo}>Undo</button>
		<button onClick={commands.redo}>Undo</button>
	</main>
}

ReactDOM.render(<App />, document.querySelector("#app"));