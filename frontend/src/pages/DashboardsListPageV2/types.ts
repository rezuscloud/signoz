<<<<<<< HEAD
// Relative "updated within" windows offered by the Updated filter chip.
export type UpdatedWindow = 'any' | 'today' | '7d' | '30d';

// The user-controllable filter state a view captures. (Tags are intentionally
// excluded for now — the tag filter UI is deferred.) Sort/order are handled
// separately via URL query params and are not part of a view snapshot.
=======
import type {
	DashboardtypesListOrderDTO,
	DashboardtypesListSortDTO,
} from 'api/generated/services/sigNoz.schemas';

// Relative "updated within" windows offered by the Updated filter chip.
export type UpdatedWindow = 'any' | 'today' | '7d' | '30d';

// A tag selected in the Tags filter chip — a concrete key:value pair drawn from
// the tags the list API reports across the org's dashboards.
export interface SelectedTag {
	key: string;
	value: string;
}

// The user-controllable filter state a view captures. `search` is a raw filter
// DSL fragment the user types; the structured chips (created-by, updated, tags)
// are AND-ed onto it. Sort/order are handled separately via URL query params and
// are not part of a view snapshot.
>>>>>>> upstream/main
export interface DashboardFilterState {
	search: string;
	createdBy: string[]; // emails (created_by)
	updated: UpdatedWindow;
<<<<<<< HEAD
}

// A saved view: a named, iconed snapshot of filter state. Persisted client-side
// (localStorage) until the views API lands.
export interface SavedView {
	id: string;
	name: string;
	icon: string; // @signozhq/icons icon name
	filters: DashboardFilterState;
	createdAt: number;
}

// Built-in views rendered above the user's saved views. Their result set is
// derived (a fixed query fragment or a client-side id set), never persisted.
export type BuiltinViewId = 'mine' | 'favorites' | 'recent' | 'all' | 'locked';
=======
	tags: SelectedTag[];
}

// A saved view: a named filter the org shares, persisted via the backend Views
// API. The backend stores a flat `{ query, sort, order }` (no structured chips),
// so a view captures the fully-combined DSL query plus the sort/order to apply.
export interface SavedView {
	id: string;
	name: string;
	query: string;
	sort: DashboardtypesListSortDTO;
	order: DashboardtypesListOrderDTO;
}

// The payload for creating or updating a saved view (everything but the id).
export type SavedViewInput = Omit<SavedView, 'id'>;

// Built-in views rendered above the user's saved views. Their result set is
// derived (a fixed query fragment or a client-side id set), never persisted.
// String values double as the URL `view` param, so they must stay stable.
export enum BuiltinViewId {
	Mine = 'mine',
	Pinned = 'pinned',
	Recent = 'recent',
	All = 'all',
	Locked = 'locked',
}
>>>>>>> upstream/main

export type ViewSection = 'personal' | 'system' | 'custom';
