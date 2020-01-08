export type Map<V> = {
	type: "map";
	children: {
		[key in keyof V]: Schema<V[key]>;
	};
	do(v: V): void;
};

export type String<V> = {
	type: "string";
	default: V;
	example: V;
	do(v: V): void;
};

export type Schema<V> = V extends string ? String<V> : Map<V>;
export const map = <V>(schema: Omit<Map<V>, "type">): Map<V> => ({ type: "map", ...schema });
export const string = <V>(schema: Omit<String<V>, "type">): String<V> => ({
	type: "string",
	...schema
});

export const foo = map({
	children: {
		hello: string({
			default: "hello",
			example: "hello",
			do: v => null
		})
	},
	do: v => null
});
