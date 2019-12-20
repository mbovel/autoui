import * as React from "react";
import { Primitive } from "../autoform/utils";
import { ValueProps, SelectProps } from "./Components";
import { pick } from "lodash-es";
import { Feedback, FeedbackClasses, feedbackClass } from "./Feedback";

const defaultFeedbackClasses: FeedbackClasses = {
	error: "error",
	warning: "warning",
	info: "info",
	ok: "ok",
	none: ""
};

export function formElementProps<V extends Primitive>(
	props: ValueProps<V>,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses
): React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
	return {
		...pick(props, "onChange", "onBlur", "id"),
		className: className + " " + feedbackClass(props.feedback, feedbackClasses),
		value: props.value ? props.value.toString() : ""
	};
}

export function feedback(
	feedback: Feedback,
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses
) {
	return (
		feedback &&
		feedback.map((it, i) => (
			<small key={i} className={feedbackClasses[it.type]}>
				{it.message}
			</small>
		))
	);
}

export function inputWithFeedback<V extends Primitive>(
	type: string,
	props: ValueProps<V>,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses,
	inputFeedbackClasses: FeedbackClasses = feedbackClasses
) {
	return (
		<>
			{input(props, type, className, inputFeedbackClasses)}
			{feedback(props.feedback, feedbackClasses)}
		</>
	);
}

export function selectWithFeedback(
	props: SelectProps,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses,
	selectFeedbackClasses: FeedbackClasses = feedbackClasses
) {
	return (
		<>
			{select(props, className, selectFeedbackClasses)}
			{feedback(props.feedback, feedbackClasses)}
		</>
	);
}

export function textareaWithFeedback(
	props: ValueProps<string>,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses,
	textareaFeedbackClasses: FeedbackClasses = feedbackClasses
) {
	return (
		<>
			{textarea(props, className, textareaFeedbackClasses)}
			{feedback(props.feedback, feedbackClasses)}
		</>
	);
}

export function input<V extends Primitive>(
	props: ValueProps<V>,
	type: string,
	className: string = "",
	feedbackClasses: FeedbackClasses
) {
	return <input type={type} {...formElementProps(props, className, feedbackClasses)} />;
}

export function textarea<V extends Primitive>(
	props: ValueProps<V>,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses
) {
	return <textarea {...formElementProps(props, className, feedbackClasses)} />;
}

export function select(
	props: SelectProps,
	className: string = "",
	feedbackClasses: FeedbackClasses = defaultFeedbackClasses
) {
	return (
		<select {...formElementProps(props, className, feedbackClasses)}>
			{Object.entries(props.options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	);
}
