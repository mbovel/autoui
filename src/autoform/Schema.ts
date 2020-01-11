import { ErrorList } from "../ui/Errors";
import { RenderProps, RenderFunction } from "./RenderProps";
import { JSON, JSONObject, JSONArray } from "./utils";
import { ComponentType } from "react";

export interface Schema<D extends JSON> {
	getChild(data: JSON, parentData: JSONObject | JSONArray, key: string, current: this): Schema<D>;
	validate(data: D): ErrorList;
	render: RenderFunction<RenderProps<D>>;
	component: ComponentType<RenderProps<D>>;
}
