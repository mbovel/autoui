import { Primitive } from "./utils";
import { State } from "./State";

export type Action =
	| {
			type: "set";
			path: string;
			data: Primitive;
	  }
	| {
			type: "unset";
			path: string;
	  }
	| {
			type: "insertAfter";
			path: string;
			key: string;
			index: number;
			data: State;
	  }
	| {
			type: "remove";
			path: string;
			key: string;
	  }
	| {
			type: "sort";
			path: string;
			compare: (a: any, b: any) => number;
	  }
	| {
			type: "blur";
			path: string;
	  }
	| {
			type: "focus";
			path: string;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };

export function actionToString(action: Action) {
	switch (action.type) {
		case "set":
			return `Set ${action.path} to ${JSON.stringify(action.data)}`;
		case "insertAfter":
			return `Add ${JSON.stringify(action.data)} in ${action.path} at ${action.index} `;
		case "remove":
			return `Remove ${JSON.stringify(action.key)} from ${action.path}`;
		case "sort":
			return `Sort ${JSON.stringify(action.path)}`;
	}
}
