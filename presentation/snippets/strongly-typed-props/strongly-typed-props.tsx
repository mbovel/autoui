import {
	defaultComponents,
	useImmerStore,
	stateFromJson,
	Auto as _Auto,
	NoSchemaDeriver,
	storeToProps
} from "../../../src";
import ReactDOM from "react-dom";
import React, { useDebugValue } from "react";
import { StoreOf } from "../../../src/model/Store";
import { DataPropsOf } from "../../../src/ui/Props";
import { JSONType } from "../../../src/model/utils";
export const Auto = _Auto as any;
const derive = NoSchemaDeriver(defaultComponents);
function typedStoreToProps<D extends JSONType>(store: StoreOf<D>): DataPropsOf<D> {
	return derive(storeToProps(store), store.dispatch) as any;
}

const UI = defaultComponents;
console.log(UI);

const initialState = stateFromJson({
	firstname: "Arthur",
	lastname: "Rimbaud",
	age: 37,
	detail: {
		IBAN: "",
		AVS: ""
	}
});

function App() {
	const store = useImmerStore(initialState);
	console.log("store", store);
	const props = typedStoreToProps(store);
	useDebugValue(props);
	console.log("props", props);

	props.children.firstname._render = props => {
		return <div style={{ backgroundColor: "pink" }}>Hello</div>;
	};

	return (
		<main>
			<form>
				<Auto {...props} />
			</form>
		</main>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
