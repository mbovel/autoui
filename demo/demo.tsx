import * as Automerge from "automerge";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { defaultComponents } from "../src/ui/default";
import { automergeReducer } from "../src/autoform/reducers/automergeReducer";
import { uikitComponents } from "../src/ui/uikit";
import { useDataProps } from "../src/autoform/useDataProps";
import { mapValues } from "lodash-es";
import { AutoForm } from "../src/autoform/AutoForm";
import { UIError, DataPropsFrom } from "../src/ui/Props";
import { JSONType } from "../src/autoform/utils";
import * as Ajv from "ajv";
import { JSONSchema7 } from "json-schema";
import { fromJs } from "../src/autoform/State";
const ajv = new Ajv();

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

const initialData = {
	theme: "uikit" as keyof typeof themes,

	firstname: "Matthieu",
	lastname: "Bovel",
	email: "mbovel@me.com",
	url: "http://www.example.com",
	friends: [
		{
			firstname: "John",
			lastname: "Smith"
		},
		{
			firstname: "Ada",
			lastname: "Lovelace"
		}
	]
};
const initialState = Automerge.from(initialData);

const schema: JSONSchema7 = {
	properties: {
		email: {
			type: "string",
			format: "email"
		},
		url: {
			type: "string",
			format: "uri"
		}
	}
};

function ajvValidate(data: JSONType, path: string): UIError[] {
	if (path) return [];
	var valid = ajv.validate(schema, data);
	console.log("data", data);
	console.log(valid);
	if (!valid && ajv.errors) {
		const uiErrors = ajv.errors.map(error => ({
			message: error.message ?? "",
			path: error.dataPath.slice(1)
		}));
		return uiErrors;
	}
	return [];
}

function App() {
	const props = useDataProps(initialState, automergeReducer) as DataPropsFrom<typeof initialData>;
	const { UI, stylesheet } = themes[props.data.theme];
	const { theme, firstname, lastname, email, url, ...otherChildren } = props.children;
	return (
		<>
			{stylesheet && (
				<Head>
					<link rel="stylesheet" href={stylesheet} />
				</Head>
			)}
			<main>
				<UI.Select {...theme} options={selectOptions} />
				<UI.Row>
					<UI.Column>
						<AutoForm {...firstname} UI={UI} />
					</UI.Column>
					<UI.Column>
						<AutoForm {...lastname} UI={UI} />
					</UI.Column>
				</UI.Row>
				<UI.Row>
					<UI.Column>
						<AutoForm {...email} UI={UI} />
					</UI.Column>
					<UI.Column>
						<AutoForm {...url} UI={UI} />
					</UI.Column>
				</UI.Row>
				{Object.entries(otherChildren).map(([key, childProps]) => (
					<AutoForm {...childProps} key={key} UI={UI} />
				))}
			</main>
		</>
	);
}

ReactDOM.render(<App />, document.querySelector("#app"));
