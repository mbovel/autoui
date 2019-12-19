import * as React from "react";
import { Components, ValueProps } from "../Components";
import { getFeedbackType, Feedback } from "../Feedback";
import { pick } from "lodash-es";
import { Primitive } from "../../autoform/utils";
import { InputHTMLAttributes } from "react";

export const defaultComponents: Components = {
	main: ({ children }) => <main>{children}</main>,
	form: ({ children }) => <form>{children}</form>,
	section: ({ children, title }) => (
		<section>
			<h1>{title}</h1>
			{children}
		</section>
	),
	textinput: props => <DefaultInput type="text" {...props} />,
	number: props => <DefaultInput type="number" {...props} />,
	checkbox: props => <DefaultInput type="checkbox" {...props} />,
	textarea: props => (
		<>
			<textarea
				{...htmlInputProps(props)}
				className={"feedback-" + getFeedbackType(props.feedback)}
			/>
			<DefaultFeedback feedback={props.feedback} />
		</>
	),
	date: props => <DefaultInput type="date" {...props} />,
	select: ({ value, onChange, options }) => (
		<select value={value} onChange={onChange}>
			{Object.entries(options).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	),
	label: ({ title, children }) => (
		<p>
			<label>
				{title} {children}
			</label>
		</p>
	)
};

export function htmlInputProps<V extends Primitive>(
	props: ValueProps<V>
): InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
	return {
		...pick(props, "onChange", "onBlur", "id"),
		value: props.value?.toString() || ""
	};
}

interface DefaultInputProps<V> extends ValueProps<V> {
	type: string;
}

function DefaultFeedback({ feedback }: { feedback: Feedback }) {
	return (
		<>
			{feedback?.map((it, i) => <span key={i} className={"feedback-" + it.type}>{it.message}</span>)} 
		</>
	);
}

function DefaultInput<V extends Primitive>(props: DefaultInputProps<V>) {
	return (
		<>
			<input
				type={props.type}
				{...htmlInputProps(props)}
				className={"feedback-" + getFeedbackType(props.feedback)}
			/>
			<DefaultFeedback feedback={props.feedback} />
		</>
	);
}
