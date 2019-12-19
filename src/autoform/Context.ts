import { Action } from "./Action";
import { Validator } from "./Validator";
import { FullMapper } from "./Mapper";
import { Feedback, filterFeedbackByPath, mergeFeedbacks } from "../components/Feedback";
import { Components } from "../components/Components";
import { Tree, pathHead, pathTail, pathAppend } from "./utils";
import { isObject } from "lodash-es";

export interface Context<D = any> {
	data: D;
	dispatch: (action: Action) => void;
	mapper: FullMapper;
	validator: Validator;
	feedback?: Feedback;
	UI: Components;
	touched: Tree<boolean>;
	path: string;
}

export function childContext(ctx: Context, relPath: string): Context {
	if (relPath === "") return ctx;
	const key = pathHead(relPath);
	const path = pathAppend(ctx.path, key);
	const data = ctx.data[key];
	const touched = isObject(ctx.touched) ? ctx.touched[key] : ctx.touched;
	const feedback = mergeFeedbacks(
		ctx.validator(data, path),
		filterFeedbackByPath(ctx.feedback, path)
	);
	return childContext({ ...ctx, data, touched, path, feedback }, pathTail(relPath));
}
