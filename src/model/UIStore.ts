import { UIAction } from "./UIAction";
import { Store } from "./Store";
import { UI } from "./UI";

export type UIStore = Store<UI, UIAction>;
