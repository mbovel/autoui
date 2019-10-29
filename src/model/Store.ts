import { State } from "./State";
import { Action } from "./Action";
import { Backend } from "./Backend";

export class Store<S extends State = State> {
	private subscribers: Set<() => void> = new Set();
	private state: Readonly<S> = this.backend.initialState;
	constructor(private backend: Backend<S>) {}

	getState(): Readonly<S> {
		return this.state;
	}

	dispatch(action: Action): void {
		this.state = this.backend.dispatch(action);
		for (const f of this.subscribers) f();
	}

	subscribe(callback: () => void): () => void {
		this.subscribers.add(callback);
		return () => this.subscribers.delete(callback);
	}
}
