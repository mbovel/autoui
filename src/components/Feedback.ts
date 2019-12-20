import { min, isPlainObject } from "lodash-es";

export interface FeedbackItem {
	path: string;
	type: "error" | "warning" | "info" | "ok";
	message: string;
}

export type FeedbackType = FeedbackItem["type"];

// Any way to avoid repeating ?
export const feedbackTypes = ["error", "warning", "info", "ok"] as const;

// And this? (“An index signature parameter type cannot be a union type.”)
export interface FeedbackClasses {
	"error": string,
	"warning": string,
	"info": string,
	"ok": string,
	"none": string
}

export type Feedback = FeedbackItem[] | undefined;

export function mergeFeedbacks(a: Feedback, b: Feedback): Feedback {
	return a && b ? a.concat(b) : a || b;
}

export function filterFeedbackByPath(feedback: Feedback, path: string) {
	const filtered = feedback?.filter(it => it.path.startsWith(path));
	return filtered?.length === 0 ? undefined : filtered
}

export function isFeedbackItem(feedback: Feedback | FeedbackItem): feedback is FeedbackItem {
	return isPlainObject(feedback);
}

export function getFeedbackType(feedback: Feedback | FeedbackItem): FeedbackType | "none" {
	if(isFeedbackItem(feedback)) return feedback.type;
	if (!feedback || feedback.length === 0) return "none";
	const index = min(feedback.map(it => feedbackTypes.indexOf(it.type))) as number
	return feedbackTypes[index];
}

export function feedbackClass(feedback: FeedbackItem | Feedback, classes: FeedbackClasses) {
	return classes[getFeedbackType(feedback)]
}