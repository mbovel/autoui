import { InputProps } from "../ui/Props";
import { JSONObject, JSONArray, JSON } from "./utils";
import { ReactElement } from "react";

export interface MapRenderProps<D extends JSONObject> {
	children: { [K in keyof D]: ReactElement };
}

export interface ListRenderProps {
	children: ReactElement[];
}

export type RenderProps<D extends JSON> = D extends string
	? InputProps<string>
	: D extends number
	? InputProps<number>
	: D extends boolean
	? InputProps<boolean>
	: D extends JSONObject
	? MapRenderProps<D>
	: D extends JSONArray
	? ListRenderProps
	: never;

export type RenderFunction<D extends JSON> = (props: RenderProps<D>) => ReactElement;
