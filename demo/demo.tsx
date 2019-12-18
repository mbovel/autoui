import { Auto } from "../src/react-ui-components/Auto";
import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AutomergeStore } from "../src/json-ui-store/AutomergeStore";
import { customJsonUIMapper } from "../src/json-ui-store/jsonToUI";
import { uikitComponents } from "../src/react-ui-components/uikit/index";
import { mapStore } from "../src/store/mapStore";
import { jsonStateToUI } from "../src/json-ui-store/jsonStateToUi";
import { Store } from "../src/store/Store";
import { bootstrapComponents } from "../src/react-ui-components/bootstrap/index";
import { FunctionComponent } from "react";

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

const CoolDiv: FunctionComponent = React.memo(({ children }) => (
	<div className="cool">{children}</div>
));

const foo = (
	<CoolDiv>
		<CoolDiv>
			<CoolDiv>Hello</CoolDiv>
		</CoolDiv>
	</CoolDiv>
);

function App() {
	const data = useStore(store).data;
	const ui = useStore(uiStore);

	return (
		<>
			{foo}
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
