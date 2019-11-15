export type UIAction =
	| {
			type: "set";
			path: string[];
			value: any;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };
