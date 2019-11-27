import { Store } from "./Store";

export function mapStore<S1, S2, A, Args extends unknown[]>(
	store: Store<S1, A>,
	fn: (s: S1, store: Store<S1, A>, ...args: Args) => S2,
	...args: Args
): Store<S2, A> {
	return {
		subscribe: store.subscribe.bind(store),
		dispatch: store.dispatch.bind(store),
		getState: () => fn(store.getState(), store, ...args)
	};
}
