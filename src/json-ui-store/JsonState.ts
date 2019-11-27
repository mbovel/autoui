export type Json = string | number | boolean | Date | JsonObject | JsonArray;
export interface JsonObject {
	[key: string]: Json;
}
export interface JsonArray extends Array<Json> {}

export interface JsonState<D extends Json> {
	data: D;
	touched: Tree<boolean>;
}

export type Tree<V> =
	| V
	| {
			[key: string]: Tree<V>;
	  };
