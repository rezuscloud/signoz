import type { StateCreator } from 'zustand';

import type { DashboardStore } from '../useDashboardStore';

/**
 * Edit context shared across the V2 dashboard tree — the dashboard id, whether
 * the user can edit, and the react-query refetch. Set once by DashboardContainer
 * so hooks/components read it from the store instead of receiving it as props
 * through every layer. Not persisted.
 */
export interface EditContextSlice {
	dashboardId: string;
	isEditable: boolean;
	refetch: () => void;
	setEditContext: (ctx: {
		dashboardId: string;
		isEditable: boolean;
		refetch: () => void;
	}) => void;
}

export const createEditContextSlice: StateCreator<
	DashboardStore,
	[['zustand/persist', unknown]],
	[],
	EditContextSlice
<<<<<<< HEAD
> = (set) => ({
	dashboardId: '',
	isEditable: false,
	refetch: (): void => undefined,
	setEditContext: (ctx): void => {
=======
> = (set, get) => ({
	dashboardId: '',
	isEditable: false,
	refetch: (): void => undefined,
	// Idempotent (no-op when unchanged) so it's safe to call during render.
	setEditContext: (ctx): void => {
		const { dashboardId, isEditable, refetch } = get();
		if (
			dashboardId === ctx.dashboardId &&
			isEditable === ctx.isEditable &&
			refetch === ctx.refetch
		) {
			return;
		}
>>>>>>> upstream/main
		set({
			dashboardId: ctx.dashboardId,
			isEditable: ctx.isEditable,
			refetch: ctx.refetch,
		});
	},
});
