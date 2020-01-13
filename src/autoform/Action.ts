import { Primitive, JSON } from "./utils";

export type Action =
	| {
			type: "set";
			path: string;
			value: JSON;
	  }
	| {
			type: "unset";
			path: string;
	  }
	| {
			type: "insertAt";
			path: string;
			index: number;
			value: JSON;
	  }
	| {
			type: "removeAt";
			path: string;
			index: number;
	  }
	| {
			type: "move";
			fromPath: string;
			fromIndex: number;
			toPath: string;
			toIndex: number;
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
