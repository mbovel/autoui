export type UIAction =
	| {
			type: "set";
			id: string;
			value: any;
	  }
	| {
			type: "touch";
			id: string;
	  }
	| {
			type: "undo";
	  }
	| {
			type: "redo";
	  };
