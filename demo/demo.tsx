import {
	NoSchemaDeriver,
	defaultComponents,
	useImmerStore,
	storeToProps,
	stateFromJson,
	Auto,
	uikitComponents,
	useAutomergeStore,
	relaxngToJsonSchema,
	JsonSchemaDeriver,
	getInitialData,
	storeToCommands,
	actionToString
} from "../src";
import ReactDOM from "react-dom";
import React, { useState, ReactNode, memo } from "react";
import mapValues from "lodash/mapValues";
import { Components } from "../src/ui/Components";
import Editor from "react-simple-code-editor";
import * as prism from "prismjs";
import { State, isPrimitiveState, isArrayState } from "../src/model/State";
import { Store } from "../src/model/Store";
import { Deriver } from "../src/model/Deriver";

const uiConfigs = {
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

const uiOptions = mapValues(uiConfigs, t => t.name);
type uiID = keyof typeof uiConfigs;

const storeConfigs = {
	immer: {
		name: "Immer",
		allowEditSchema: true,
		useStore: useImmerStore
	},
	automerge: {
		name: "Automerge",
		allowEditSchema: false,
		useStore: useAutomergeStore
	}
} as const;

const storeOptions = mapValues(storeConfigs, t => t.name);
type StoreID = keyof typeof storeConfigs;

const deriverConfigs = {
	noSchema: {
		name: "No Schema",
		makeDeriverAndInitialState: (data: string, UI: Components) =>
			[NoSchemaDeriver(UI), stateFromJson(JSON.parse(data))] as const,
		deriverDataName: "Initial JSON",
		deriverDataType: "javascript",
		initialDeriverData: JSON.stringify(
			{
				firstname: "Arthur",
				lastname: "Rimbaud",
				age: 37,
				isAdult: true,
				isDead: true,
				details: {
					something: ""
				}
			},
			undefined,
			4
		)
	},
	relaxng: {
		name: "RelaxNG",
		makeDeriverAndInitialState: (data: string, UI: Components) => {
			const schema = relaxngToJsonSchema(data);
			return [JsonSchemaDeriver(UI, schema), stateFromJson(getInitialData(schema))] as const;
		},
		deriverDataName: "RelaxNG Schema",
		deriverDataType: "markup",
		initialDeriverData: "<hello></hello>"
	},
	jsonschema: {
		name: "Json Schema",
		makeDeriverAndInitialState: (data: string, UI: Components) => {
			const schema = JSON.parse(data);
			return [JsonSchemaDeriver(UI, schema), stateFromJson(getInitialData(schema))] as const;
		},
		deriverDataName: "Json Schema",
		deriverDataType: "javascript",
		initialDeriverData: "{}"
	}
} as const;

const deriverOptions = mapValues(deriverConfigs, t => t.name);
type DeriverID = keyof typeof deriverConfigs;

function Form({
	useStore,
	initialState,
	derive
}: {
	useStore: (state: State) => Store;
	initialState: State;
	derive: Deriver;
}) {
	console.log("--------------------------");
	console.log("Start Form");
	const store = useStore(initialState);
	const props = derive(storeToProps(store), store.dispatch);
	const commands = storeToCommands(store);
	return (
		<>
			<div id="result">
				<form>
					<Auto {...props} />
				</form>
			</div>
			<div id="state">
				<Collapsable
					showTitle="Show state"
					hideTitle="Hide state"
					showContent="◀︎"
					initialOpened={true}
				>
					<h1>State (debug)</h1>
					<div id="state-debug">
						<StateView state={store.state} />
					</div>
					<h1>History</h1>
					<button onClick={commands.undo}>Undo</button>
					<button onClick={commands.redo}>Redo</button>
					<ul>
						{store.history.reverse().map((it, key) => (
							<li key={key}>{actionToString(it.action)}</li>
						))}
					</ul>
				</Collapsable>
			</div>
		</>
	);
}

let counter = 0;

function App() {
	const [uiId, setUiId] = useState<uiID>("uikit");
	const { UI, stylesheet } = uiConfigs[uiId];

	const [storeId, setStoreId] = useState<StoreID>("immer");
	const { useStore } = storeConfigs[storeId];

	const [deriverId, _setDeriverId] = useState<DeriverID>("noSchema");
	const {
		deriverDataType,
		deriverDataName,
		initialDeriverData,
		makeDeriverAndInitialState
	} = deriverConfigs[deriverId];

	const [_deriverData, setDeriverData] = useState<string | undefined>(initialDeriverData);
	const deriverData = _deriverData ?? initialDeriverData;
	const setDeriverId = (id: DeriverID) => {
		_setDeriverId(id);
		setDeriverData(undefined);
	};

	let derive: Deriver | undefined;
	let initialState: State | undefined;
	try {
		[derive, initialState] = makeDeriverAndInitialState(deriverData, UI);
	} catch (e) {
		console.error(e);
		derive = undefined;
		initialState = undefined;
	}

	return (
		<>
			{stylesheet && (
				<Head>
					<link rel="stylesheet" href={stylesheet} />
				</Head>
			)}
			<div id="config">
				<Collapsable
					showTitle="Show config"
					hideTitle="Hide config"
					showContent="►"
					initialOpened={true}
				>
					<h1>Configuration</h1>
					<UI.Select<uiID>
						data={uiId}
						onChange={setUiId}
						options={uiOptions}
						label="UI"
					/>
					<UI.Select<StoreID>
						data={storeId}
						onChange={setStoreId}
						options={storeOptions}
						label="Store"
					/>
					<UI.Select<DeriverID>
						data={deriverId}
						onChange={setDeriverId}
						options={deriverOptions}
						label="Deriver"
					/>
					<DeriverDataInput
						onChange={setDeriverData}
						language={deriverDataType}
						title={deriverDataName}
						value={deriverData}
					/>
				</Collapsable>
			</div>
			{initialState && derive ? (
				<Form
					useStore={useStore}
					initialState={initialState}
					derive={derive}
					key={++counter}
				/>
			) : (
				<div id="result">
					<form>
						<p>Sorry, I cannot make sense of deriver data ({deriverDataName})…</p>
					</form>
				</div>
			)}
		</>
	);
}

function DeriverDataInput({
	language,
	title,
	value,
	onChange
}: {
	language: string;
	title: string;
	value: string;
	onChange: (data: string) => void;
}) {
	return (
		<>
			<h1>{title}</h1>
			<Editor
				textareaClassName="deriver-data"
				value={value}
				onValueChange={onChange}
				highlight={code => prism.highlight(code, prism.languages[language], language)}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 14
				}}
			/>
		</>
	);
}

function Collapsable({
	children,
	showTitle,
	hideTitle,
	showContent,
	hideContent = "⨯",
	initialOpened = false
}: {
	children: ReactNode;
	showTitle: string;
	hideTitle: string;
	showContent: string;
	hideContent?: string;
	initialOpened?: boolean;
}) {
	const [opened, setOpened] = useState(initialOpened);
	return opened ? (
		<div className="opened">
			<button onClick={() => setOpened(false)} className="hide" title={hideTitle}>
				{hideContent}
			</button>
			{children}
		</div>
	) : (
		<div className="closed">
			<button onClick={() => setOpened(true)} className="show" title={showTitle}>
				{showContent}
			</button>
		</div>
	);
}

const StateView = memo(({ state }: { state: State }) => {
	return (
		<>
			{isPrimitiveState(state) ? "" : isArrayState(state) ? "Array" : "Object"}
			{isPrimitiveState(state) && (
				<span className={"value token " + typeof state.value}>
					{JSON.stringify(state.value)}
				</span>
			)}
			{state.touched ? <span className="touched badge">touched</span> : undefined}
			{state.focusedBy?.length ? <span className="active badge">active</span> : undefined}
			{!isPrimitiveState(state) && (
				<dl>
					{Object.entries(state.children).flatMap(([key, value]) => [
						<dt key={key + ".key"}>{key}: </dt>,
						<dd key={key + ".content"}>
							<StateView state={value} />
						</dd>
					])}
				</dl>
			)}
		</>
	);
});

function Head({ children }: { children: ReactNode }) {
	return ReactDOM.createPortal(children, document.head);
}

ReactDOM.render(<App />, document.querySelector("#app"));
