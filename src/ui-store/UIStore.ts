import { UIAction } from "./UIAction";
import { Store } from "../store/Store";
import { UIElement } from "../ui/ui";

export type UIStore = Store<UIElement, UIAction>;
