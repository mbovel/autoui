import { JSONType, Primitive } from "./utils";
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
