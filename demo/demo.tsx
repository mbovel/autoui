import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useReducer, Reducer } from "react";
import { mergeRenderers } from "../src/autoform/Renderer";
import { defaultComponents } from "../src/ui/default";
import { valueProps, defaultMapper } from "../src/autoform/defaultMapper";
import { isString, isNumber, mapValues } from "lodash-es";
import { Validator } from "../src/autoform/Validator";
import { automergeReducer } from "../src/autoform/reducers/automergeReducer";
import { Action } from "../src/autoform/Action";
import { AutoForm } from "../src/autoform/JsonForm";
import { uikitComponents } from "../src/ui/uikit";
import { pathAppend } from "../src/autoform/utils";
import { Schema } from "../src/autoform/DerivedData";
import { Components } from "../src/ui/Components";

const themes = {
	uikit: {
		name: "UIKit",
		stylesheet: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/css/uikit.min.css",
		components: uikitComponents
	},
	default: {
		name: "Default",
		stylesheet: undefined,
		components: defaultComponents
	}
} as const;

const options = mapValues(themes, _ => _.name);

function getSchema(UI: Components): Schema {
	return {
		type: "map",
		properties: {
			theme: {
				type: "string",
				render: props => <UI.Select {...valueProps(context)} options={options} />
			}
		}
	};
}

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
	},
	touched: {}
});

function App() {
	const [state, dispatch] = useReducer(
		automergeReducer as Reducer<typeof initialState, Action>,
		initialState
	);
	const { components: UI, stylesheet } = themes[state.data.theme];
	return (
		<>
			{stylesheet && (
				<Head>
					<link rel="stylesheet" href={stylesheet} />
				</Head>
			)}

			<UI.Main>
				<AutoForm
					data={state.data}
					touched={state.touched}
					UI={UI}
					dispatch={dispatch}
					mapper={myMapper}
					validator={myValidator}
					path=""
					feedback={myValidator(state.data, "")}
				/>
			</UI.Main>
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
