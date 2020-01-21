import {
	NoSchemaDeriver,
	defaultComponents,
	useImmerStore,
	storeToProps,
	stateFromJson,
	Auto,
	uikitComponents,
	useAutomergeStore
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
		getInitialState: (data: string) => stateFromJson(JSON.parse(data)),
		makeDeriver: (_: string, UI: Components) => NoSchemaDeriver(UI),
		deriverDataName: "Initial JSON",
		deriverDataType: "javascript",
		initialDeriverData: JSON.stringify(
			{
				firstname: "",
				lastname: "",
				age: 25,
				isAdult: true,
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
		getInitialState: (data: string) => stateFromJson({}),
		makeDeriver: (data: string, UI: Components) => NoSchemaDeriver(UI),
		deriverDataName: "RelaxNG Schema",
		deriverDataType: "markup",
		initialDeriverData: "<hello></hello>"
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
	const store = useStore(initialState);
	const props = derive(storeToProps(store), store.dispatch);
	//const commands = storeToCommands(store.state, store.dispatch);

	console.log("--------------------------");
	console.log("Start rendering");
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
					<h1>History</h1>
					<h1>State (debug)</h1>
					<div id="state-debug">
						<StateView state={store.state} />
					</div>
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
		makeDeriver,
		getInitialState
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
		derive = makeDeriver(deriverData, UI);
		initialState = getInitialState(deriverData);
	} catch {
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
					Sorry, I cannot make sense of deriver data ({deriverDataName})…
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
					{Object.entries(state.children).map(([key, value]) => (
						<>
							<dt>{key}: </dt>
							<dd>
								<StateView state={value} />
							</dd>
						</>
					))}
				</dl>
			)}
		</>
	);
});

function Head({ children }: { children: ReactNode }) {
	return ReactDOM.createPortal(children, document.head);
}

ReactDOM.render(<App />, document.querySelector("#app"));
