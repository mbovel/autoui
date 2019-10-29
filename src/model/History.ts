import { Action } from "./Action";

export type History = HistoryEntry[];

interface HistoryEntry {
	author: Author;
	action: Action;
}

interface Author {
	firstname: string;
	lastname: string;
	picture: string;
}
