import { JSONType } from "./utils";

export type Action =
	| {
			type: "set";
			path: string;
			data: JSONType;
	  }
	| {
			type: "unset";
			path: string;
	  }
	| {
			type: "insertAfter";
			path: string;
			index: number;
			data: JSONType;
	  }
	| {
			type: "removeAt";
			path: string;
			index: number;
	  }
	| {
			type: "sort";
			path: string;
			compare: (a: any, b: any) => number;
	  }
	| {
			type: "blur";
			path: string;
			user: string;
	  }
	| {
			type: "focus";
			path: string;
			user: string;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };
