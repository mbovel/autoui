import { Tree } from "./utils";

export interface State {
	data: any;
	touched: Tree<boolean>;
}
