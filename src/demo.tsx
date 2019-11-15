import { Auto } from "./react-ui-components/Auto";
import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AutomergeStore } from "./ui-store/AutomergeStore";
import { makeJsonToUI } from "./ui-store/jsonToUI";
import { withActions } from "./ui-store/withActions";

const store = AutomergeStore(
	Automerge.from({
		firstname: "Matthieu",
		lastname: "Bovel",
		details: {
			email: "mbovel@me.com"
		}
	})
);
const jsonToUI = makeJsonToUI();

class Head extends React.Component {
	public render() {
		return ReactDOM.createPortal(this.props.children, document.head);
	}
}

function App() {
	const [ui, setUI] = React.useState(store.getState());
	const [theme, setTheme] = React.useState("material");
	React.useEffect(() => {
		return store.subscribe(() => setUI(store.getState()));
	}, []);

	return (
		<>
			<select onChange={e => setTheme(e.target.value)} value={theme}>
				<option value="ui-kit">UI Kit</option>
				<option value="material">Material</option>
				<option value="naked">Naked</option>
			</select>
			{theme === "ui-kit" && (
				<>
					<Head>
						<link
							rel="stylesheet"
							href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/css/uikit.min.css"
						/>
					</Head>
					<Auto ui={withActions(jsonToUI(ui), store)} />
				</>
			)}
			{theme === "material" && <Auto ui={withActions(jsonToUI(ui), store)} />}
			{theme === "naked" && <Auto ui={withActions(jsonToUI(ui), store)} />}
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
