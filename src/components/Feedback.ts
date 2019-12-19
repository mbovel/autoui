import { min } from "lodash-es";

export interface FeedbackItem {
	path: string;
	type: "error" | "warning" | "info" | "ok";
	message: string;
}

export type FeedbackType = FeedbackItem["type"];

// Any way to avoid repeating ?
export const feedbackTypes = ["error", "warning", "info", "ok"] as const;

export type Feedback = FeedbackItem[] | undefined;

export function mergeFeedbacks(a: Feedback, b: Feedback): Feedback {
	return a && b ? a.concat(b) : a || b;
}

export function filterFeedbackByPath(feedback: Feedback, path: string) {
	const filtered = feedback?.filter(it => it.path.startsWith(path));
	return filtered?.length === 0 ? undefined : filtered
}

export function getFeedbackType(feedback: Feedback): FeedbackType | "none" {
	if (!feedback || feedback.length === 0) return "none";
	return feedbackTypes[min(feedback.map(it => feedbackTypes.indexOf(it.type))) as number];
}
