import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { defaultComponents } from "../src/ui/default";
import { automergeReducer } from "../src/autoform/reducers/automergeReducer";
import { uikitComponents } from "../src/ui/uikit";
import { useDataProps } from "../src/autoform/useDataProps";
import { mapValues } from "lodash-es";
import { AutoForm } from "../src/autoform/AutoForm";

const themes = {
	uikit: {
		name: "UIKit",
		stylesheet: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/css/uikit.min.css",
		UI: uikitComponents
	},
	default: {
		name: "Default",
		stylesheet: undefined,
		UI: defaultComponents
	}
} as const;

const selectOptions = mapValues(themes, t => t.name);

class Head extends React.Component {
	public render() {
		return ReactDOM.createPortal(this.props.children, document.head);
	}
}

const initialState = Automerge.from({
	data: {
		theme: "uikit" as keyof typeof themes,
		firstname: "Matthieu",
		lastname: "Bovel",
		details: {
			email: "mbovel@me.com"
		},
		moreDetails: {
			age: 25,
			adult: true
		}
	}
});

function App() {
	const props = useDataProps(initialState, automergeReducer);
	console.log(props);
	const { UI, stylesheet } = themes[props.data.theme];
	const { theme: themeProps, ...otherChildrenProps } = props.children;
	return (
		<>
			{stylesheet && (
				<Head>
					<link rel="stylesheet" href={stylesheet} />
				</Head>
			)}
			<main>
				<UI.Select {...themeProps} options={selectOptions} />
				{Object.entries(otherChildrenProps).map(([key, childProps]) => (
					<AutoForm props={childProps} key={key} UI={UI} />
				))}
			</main>
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
