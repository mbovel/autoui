export type UIAction =
	| {
			type: "set";
			path: string[];
			value: string;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };
