import { Feedback } from "../components/Feedback";
import { isDefined } from "./utils";

export type Validator = (data: any, path: string) => Feedback;

export function mergeValidators(...validators: Validator[]): Validator {
	return (...args) => {
		return validators.flatMap(f => f(...args)).filter(isDefined);
	};
}
