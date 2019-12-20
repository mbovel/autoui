import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useReducer, Reducer } from "react";
import { mergeMappers } from "../src/autoform/Mapper";
import { defaultComponents } from "../src/components/default";
import { valueProps, defaultMapper } from "../src/autoform/defaultMapper";
import { isString, isNumber, mapValues } from "lodash-es";
import { Validator } from "../src/autoform/Validator";
import { automergeReducer } from "../src/autoform/automergeReducer";
import { Action } from "../src/autoform/Action";
import { AutoForm } from "../src/autoform/AutoForm";
import { uikitComponents } from "../src/components/uikit";
import { pathAppend } from "../src/autoform/utils";

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

export const myMapper = mergeMappers(context => {
	const { data, path, UI } = context;
	if (isString(data) && path === "theme") {
		return (
			<UI.Label title="Theme">
				<UI.Select {...valueProps(context)} options={options} />
			</UI.Label>
		);
	}
}, defaultMapper);

export const myValidator: Validator = (data, path) => {
	if (isNumber(data) && path === "moreDetails.age") {
		if (data < 18) {
			return [
				{
					path,
					type: "error",
					message: "You must be an adult to submit this form."
				}
			];
		} else if (data < 25) {
			return [
				{
					path,
					type: "warning",
					message: "You're still a bit young, but that's ok."
				}
			];
		}
	} else if (path === "") {
		if (data.firstname === "Matthieu" && data.lastname === "Bovel") {
			return [
				{
					path: pathAppend(path, "lastname"),
					type: "info",
					message: "You have the same name as I!"
				}
			];
		}
	}
};

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
