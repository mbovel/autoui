interface DataBase {
	touched: boolean;
}

export interface DataBranch extends DataBase {
	children: { [key: string]: DataTree };
	childrenOrder: string[];
}

export interface DataLeaf extends DataBase {
	children?: undefined /* Hack to enable union discrimination on children property */;
	value: any;
}

export type DataTree = DataBranch | DataLeaf;
