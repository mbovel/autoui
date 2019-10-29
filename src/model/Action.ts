export type Action =
	| {
			type: "set";
			path: string[];
			value: number | string;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };
