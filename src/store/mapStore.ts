import { Store } from "./Store";

export function mapStore<S1, S2, A>(
	store: Store<S1, A>,
	fn: (s: S1, store?: Store<S1, A>) => S2
): Store<S2, A> {
	return {
		...store,
		getState: () => fn(store.getState(), store)
	};
}
