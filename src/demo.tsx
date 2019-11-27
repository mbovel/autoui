import { Auto } from "./react-ui-components/Auto";
import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AutomergeStore } from "./json-ui-store/AutomergeStore";
import { customJsonUIMapper } from "./json-ui-store/jsonToUI";
import { uikitComponents } from "./react-ui-components/uikit/index";
import { mapStore } from "./store/mapStore";
import { jsonStateToUI } from "./json-ui-store/jsonStateToUi";
import { Store } from "./store/Store";
import { bootstrapComponents } from "./react-ui-components/bootstrap/index";

const store = AutomergeStore(
	Automerge.from({
		data: {
			theme: "uikit",
			firstname: "Matthieu",
			lastname: "Bovel",
			details: {
				email: "mbovel@me.com"
			},
			moreDetails: {
				age: 25,
				adult: true
			}
		},
		touched: {}
	})
);

export const stupidMapper: customJsonUIMapper = {
	value(data, path, touched) {
		if (typeof data === "string" && path === "theme") {
			return {
				type: "select",
				value: data,
				id: path,
				touched,
				options: {
					uikit: "UIKit",
					bootstrap: "Bootstrap",
					naked: "Naked"
				},
				errors: []
			};
		} else if (typeof data === "number" && path === "moreDetails.age") {
			return {
				type: "number",
				value: data,
				id: path,
				touched,
				errors: data < 18 ? ["You must be an adult to submit this form."] : []
			};
		}
	}
};

const uiStore = mapStore(store, jsonStateToUI, stupidMapper);

class Head extends React.Component {
	public render() {
		return ReactDOM.createPortal(this.props.children, document.head);
	}
}

function useStore<S, A>(store: Store<S, A>) {
	const [state, setState] = React.useState(store.getState());
	React.useEffect(() => {
		return store.subscribe(() => setState(store.getState()));
	}, []);
	return state;
}

function App() {
	const data = useStore(store).data;
	const ui = useStore(uiStore);
	console.log(ui);

	return (
		<>
			{data.theme === "uikit" && (
				<>
					<Head>
						<link
							rel="stylesheet"
							href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/css/uikit.min.css"
						/>
					</Head>
					<Auto ui={ui} theme={uikitComponents} />
				</>
			)}
			{data.theme === "bootstrap" && (
				<>
					<Head>
						<link
							rel="stylesheet"
							href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.0/css/bootstrap.min.css"
						/>
					</Head>
					<Auto ui={ui} theme={bootstrapComponents} />
				</>
			)}
			{data.theme === "naked" && <Auto ui={ui} />}
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
