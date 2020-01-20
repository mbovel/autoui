import { Dispatcher } from "./Dispatcher";
import { DataProps } from "../ui/Props";

export type Deriver = (props: DataProps, dispatch: Dispatcher) => DataProps;
