import { Auto } from "./view/Auto";
import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AutomergeStore } from "./backends/AutomergeStore";
import { jsonToUI } from "./model/jsonToUI";
import { withMethods } from "./model/withMethods";

const store = AutomergeStore(
	Automerge.from({
		firstname: "Matthieu",
		lastname: "Bovel",
		details: {
			email: "mbovel@me.com"
		}
	})
);

function App() {
	const toUI = jsonToUI();
	const [ui, setUI] = React.useState(store.getState());
	React.useEffect(() => {
		return store.subscribe(() => setUI(store.getState()));
	}, []);

	return <Auto {...withMethods(toUI(ui), store)} />;
}

ReactDOM.render(<App />, document.body);

export const test = "FOO";
