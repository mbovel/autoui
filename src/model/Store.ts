export interface Store<S, A> {
	getState(): Readonly<S>;
	dispatch(action: A, ...extraArgs: any[]): any;
	subscribe(callback: () => any): () => void;
}
