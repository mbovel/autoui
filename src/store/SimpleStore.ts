export class SimpleStore<S, A> {
	private subscribers: Array<() => void> = [];
	constructor(
		private reduce: (state: Readonly<S>, action: A) => Readonly<S>,
		private state: Readonly<S>
	) {}

	getState(): Readonly<S> {
		return this.state;
	}

	dispatch(action: A): void {
		this.state = this.reduce(this.state, action);
		for (const f of this.subscribers) f();
	}

	subscribe(callback: () => void): () => void {
		this.subscribers.push(callback);
		return () => {
			const i = this.subscribers.indexOf(callback);
			this.subscribers.splice(i, 1);
		};
	}
}
