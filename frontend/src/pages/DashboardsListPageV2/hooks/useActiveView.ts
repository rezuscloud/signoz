import { useCallback, useMemo } from 'react';
import { parseAsString, useQueryState, type Options } from 'nuqs';
<<<<<<< HEAD

import { DEFAULT_FILTER_STATE, areFilterStatesEqual } from '../filterQuery';
import { useDashboardViewsStore } from '../store/useDashboardViewsStore';
import type { DashboardFilterState, SavedView } from '../types';
import {
	BUILTIN_VIEWS,
	builtinViewQuery,
	builtinViewSnapshot,
	type BuiltinView,
	isClientView,
} from '../views';
=======
import type {
	DashboardtypesListOrderDTO,
	DashboardtypesListSortDTO,
} from 'api/generated/services/sigNoz.schemas';

import {
	areFilterStatesEqual,
	DEFAULT_FILTER_STATE,
	filterStateToQuery,
} from '../utils/filterQuery';
import { BuiltinViewId } from '../types';
import type { DashboardFilterState, SavedView } from '../types';
import {
	BUILTIN_VIEWS,
	builtinViewSnapshot,
	type BuiltinView,
	isClientView,
} from '../utils/views';
import { useSavedViews } from './useSavedViews';
>>>>>>> upstream/main

const opts: Options = { history: 'push' };

interface UseActiveViewArgs {
	filters: DashboardFilterState;
	applyFilters: (next: DashboardFilterState) => void;
	userEmail: string;
<<<<<<< HEAD
=======
	sortColumn: DashboardtypesListSortDTO;
	sortOrder: DashboardtypesListOrderDTO;
	setSortColumn: (column: DashboardtypesListSortDTO) => void;
	setSortOrder: (order: DashboardtypesListOrderDTO) => void;
>>>>>>> upstream/main
}

export interface UseActiveViewResult {
	activeViewId: string;
	builtinViews: BuiltinView[];
	customViews: SavedView[];
<<<<<<< HEAD
	isCustomActive: boolean;
	// Current filters diverge from the active view's canonical snapshot.
	isModified: boolean;
	// Extra server-query fragment the active view contributes, and whether it
	// constrains the list client-side (favorites/recent).
	viewQuery: string;
	clientView: boolean;
	selectView: (id: string) => void;
	saveView: (name: string, icon: string) => void;
	saveActiveView: () => void;
	resetView: () => void;
	removeView: (id: string) => void;
}

// Orchestrates the active view: which view is selected (URL `view` param),
// merging built-in + persisted custom views, applying a view's snapshot on
// select, dirty detection, and save/reset/delete.
=======
	customViewsLoading: boolean;
	isCustomActive: boolean;
	// Current filters diverge from the active view's canonical snapshot.
	isModified: boolean;
	// Whether the active view constrains the list client-side (pinned/recent).
	clientView: boolean;
	selectView: (id: string) => void;
	saveView: (name: string) => void;
	saveActiveView: () => void;
	resetView: () => void;
	removeView: (id: string) => void;
	renameView: (id: string, name: string) => void;
}

// The canonical filter snapshot a saved view "is": the backend stores a flat
// query, so a view folds entirely into the search box with empty chips.
const customSnapshot = (view: SavedView): DashboardFilterState => ({
	...DEFAULT_FILTER_STATE,
	search: view.query,
});

// Orchestrates the active view: which view is selected (URL `view` param),
// merging built-in + org-shared saved views, applying a view's snapshot on
// select, dirty detection, and save/reset/delete via the Views API.
>>>>>>> upstream/main
export function useActiveView({
	filters,
	applyFilters,
	userEmail,
<<<<<<< HEAD
}: UseActiveViewArgs): UseActiveViewResult {
	const [activeViewId, setActiveViewId] = useQueryState(
		'view',
		parseAsString.withDefault('all').withOptions(opts),
	);

	const customViews = useDashboardViewsStore((s) => s.customViews);
	const addView = useDashboardViewsStore((s) => s.addView);
	const updateView = useDashboardViewsStore((s) => s.updateView);
	const deleteView = useDashboardViewsStore((s) => s.deleteView);
=======
	sortColumn,
	sortOrder,
	setSortColumn,
	setSortOrder,
}: UseActiveViewArgs): UseActiveViewResult {
	const [activeViewId, setActiveViewId] = useQueryState(
		'view',
		parseAsString.withDefault(BuiltinViewId.All).withOptions(opts),
	);

	const {
		views: customViews,
		isLoading: customViewsLoading,
		createView,
		updateView,
		deleteView,
	} = useSavedViews();
>>>>>>> upstream/main

	const activeCustom = useMemo(
		() => customViews.find((v) => v.id === activeViewId),
		[customViews, activeViewId],
	);

	// The filter state the active view "is" — used to detect divergence.
	const canonicalSnapshot = useMemo<DashboardFilterState | null>(
		() =>
			activeCustom
<<<<<<< HEAD
				? activeCustom.filters
=======
				? customSnapshot(activeCustom)
>>>>>>> upstream/main
				: builtinViewSnapshot(activeViewId, userEmail),
		[activeCustom, activeViewId, userEmail],
	);

	const isModified = canonicalSnapshot
		? !areFilterStatesEqual(filters, canonicalSnapshot)
		: false;

	const selectView = useCallback(
		(id: string): void => {
			void setActiveViewId(id);
			const custom = customViews.find((v) => v.id === id);
<<<<<<< HEAD
			applyFilters(
				custom?.filters ??
					builtinViewSnapshot(id, userEmail) ??
					DEFAULT_FILTER_STATE,
			);
		},
		[setActiveViewId, customViews, applyFilters, userEmail],
	);

	const saveView = useCallback(
		(name: string, icon: string): void => {
			const id = `cv_${Date.now()}`;
			addView({
				id,
				name: name.trim(),
				icon,
				filters: { ...filters },
				createdAt: Date.now(),
			});
			void setActiveViewId(id);
		},
		[addView, filters, setActiveViewId],
	);

	const saveActiveView = useCallback((): void => {
		if (activeCustom) {
			updateView(activeCustom.id, { filters: { ...filters } });
		}
	}, [activeCustom, updateView, filters]);

	const resetView = useCallback((): void => {
		if (canonicalSnapshot) {
			applyFilters(canonicalSnapshot);
		}
	}, [canonicalSnapshot, applyFilters]);
=======
			if (custom) {
				applyFilters(customSnapshot(custom));
				setSortColumn(custom.sort);
				setSortOrder(custom.order);
				return;
			}
			applyFilters(builtinViewSnapshot(id, userEmail) ?? DEFAULT_FILTER_STATE);
		},
		[
			setActiveViewId,
			customViews,
			applyFilters,
			userEmail,
			setSortColumn,
			setSortOrder,
		],
	);

	const saveView = useCallback(
		(name: string): void => {
			// The active view's clause already lives in the filter state (e.g. Locked
			// seeds `locked = true` into search), so the chips fold into one query.
			const query = filterStateToQuery(filters);
			void (async (): Promise<void> => {
				const created = await createView({
					name,
					query,
					sort: sortColumn,
					order: sortOrder,
				});
				if (created) {
					void setActiveViewId(created.id);
					// Re-apply the folded representation so the new view isn't
					// immediately flagged as modified.
					applyFilters(customSnapshot(created));
				}
			})();
		},
		[filters, createView, sortColumn, sortOrder, setActiveViewId, applyFilters],
	);

	const saveActiveView = useCallback((): void => {
		if (!activeCustom) {
			return;
		}
		const query = filterStateToQuery(filters);
		updateView(activeCustom.id, {
			name: activeCustom.name,
			query,
			sort: sortColumn,
			order: sortOrder,
		});
		applyFilters({ ...DEFAULT_FILTER_STATE, search: query });
	}, [activeCustom, filters, updateView, sortColumn, sortOrder, applyFilters]);

	const resetView = useCallback((): void => {
		if (!canonicalSnapshot) {
			return;
		}
		applyFilters(canonicalSnapshot);
		if (activeCustom) {
			setSortColumn(activeCustom.sort);
			setSortOrder(activeCustom.order);
		}
	}, [
		canonicalSnapshot,
		applyFilters,
		activeCustom,
		setSortColumn,
		setSortOrder,
	]);
>>>>>>> upstream/main

	const removeView = useCallback(
		(id: string): void => {
			deleteView(id);
			if (activeViewId === id) {
<<<<<<< HEAD
				void setActiveViewId('all');
=======
				void setActiveViewId(BuiltinViewId.All);
>>>>>>> upstream/main
				applyFilters(DEFAULT_FILTER_STATE);
			}
		},
		[deleteView, activeViewId, setActiveViewId, applyFilters],
	);

<<<<<<< HEAD
=======
	// Rename only touches the view's name; its stored query/sort/order are preserved.
	const renameView = useCallback(
		(id: string, name: string): void => {
			const view = customViews.find((v) => v.id === id);
			if (!view) {
				return;
			}
			updateView(id, {
				name,
				query: view.query,
				sort: view.sort,
				order: view.order,
			});
		},
		[customViews, updateView],
	);

>>>>>>> upstream/main
	return {
		activeViewId,
		builtinViews: BUILTIN_VIEWS,
		customViews,
<<<<<<< HEAD
		isCustomActive: !!activeCustom,
		isModified,
		viewQuery: builtinViewQuery(activeViewId),
=======
		customViewsLoading,
		isCustomActive: !!activeCustom,
		isModified,
>>>>>>> upstream/main
		clientView: isClientView(activeViewId),
		selectView,
		saveView,
		saveActiveView,
		resetView,
		removeView,
<<<<<<< HEAD
=======
		renameView,
>>>>>>> upstream/main
	};
}
