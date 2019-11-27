import { JsonState, Json } from "./JsonState";
import { UIElement } from "../ui/ui";
import { jsonToUI, customJsonUIMapper } from "./jsonToUI";
import { withActions } from "../ui-store/withActions";
import { UIAction } from "../ui-store/UIAction";
import { Store } from "../store/Store";

export function jsonStateToUI<S extends JsonState<D>, D extends Json>(
	state: S,
	store: Store<any, UIAction>,
	customJsonUIMapper: customJsonUIMapper = {}
): UIElement {
	return withActions(jsonToUI(state.data, customJsonUIMapper, state.touched), store);
}
