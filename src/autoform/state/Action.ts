import { State } from "./State";
import { Primitive } from "../utils";

export type Action =
	| {
			type: "set";
			path: string;
			value: Primitive;
	  }
	| {
			type: "add";
			path: string;
			value: State;
			index?: number;
	  }
	| {
			type: "remove";
			path: string;
	  }
	| {
			type: "move";
			from: string;
			to: string;
			index?: number;
	  }
	| {
			type: "reorder";
			path: string;
			order: string[];
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
