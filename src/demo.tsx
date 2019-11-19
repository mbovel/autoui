import { Auto } from "./react-ui-components/Auto";
import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AutomergeStore } from "./ui-store/AutomergeStore";
import { makeJsonToUI, customJsonUIMapper } from "./ui-store/jsonToUI";
import { withActions } from "./ui-store/withActions";
import { uikitComponents } from "./react-ui-components/uikit";

const store = AutomergeStore(
	Automerge.from({
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
	})
);

export const stupidMapper: customJsonUIMapper = {
	string(data, path) {
		if (path === "theme") {
			return {
				type: "label",
				title: "Theme",
				content: {
					type: "select",
					value: data,
					path,
					options: {
						uikit: "UIKit",
						naked: "Naked"
					}
				}
			};
		}
	}
};

const jsonToUI = makeJsonToUI(stupidMapper);

class Head extends React.Component {
	public render() {
		return ReactDOM.createPortal(this.props.children, document.head);
	}
}

function App() {
	const [data, setData] = React.useState(store.getState());
	React.useEffect(() => {
		return store.subscribe(() => setData(store.getState()));
	}, []);

	const ui = withActions(jsonToUI(data), store);

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
			{data.theme === "material" && <Auto ui={ui} />}
			{data.theme === "naked" && <Auto ui={ui} />}
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
