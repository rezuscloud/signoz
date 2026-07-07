import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { v4 as uuid } from 'uuid';
<<<<<<< HEAD
import {
	getGetDashboardV2QueryKey,
	usePatchDashboardV2,
} from 'api/generated/services/dashboard';
=======
import { getGetDashboardV2QueryKey } from 'api/generated/services/dashboard';
>>>>>>> upstream/main
import {
	type DashboardtypesJSONPatchOperationDTO,
	type DashboardtypesPanelSpecDTO,
	DashboardtypesPanelKindDTO,
	DashboardtypesPatchOpDTO,
	type GetDashboardV2200,
} from 'api/generated/services/sigNoz.schemas';

<<<<<<< HEAD
=======
import { useOptimisticPatch } from '../../hooks/useOptimisticPatch';
>>>>>>> upstream/main
import { createPanelOps } from '../../patchOps';

interface UsePanelEditorSaveArgs {
	dashboardId: string;
	panelId: string;
	/** Creating a new panel (vs editing an existing one) — adds panel + layout. */
	isNew?: boolean;
	/** Target section for a new panel; falls back to the last/new section. */
	layoutIndex?: number;
}

interface UsePanelEditorSaveApi {
	save: (spec: DashboardtypesPanelSpecDTO) => Promise<void>;
	isSaving: boolean;
	error: Error | null;
}

/**
 * Persists panel edits for the V2 editor via RFC-6902 JSON Patch. Editing: one
 * `add` op replaces the whole spec. Creating (`isNew`): mints a fresh id and adds
 * a grid item in the target section. Persists only on save — cancelling never
 * touches the dashboard.
 */
export function usePanelEditorSave({
	dashboardId,
	panelId,
	isNew = false,
	layoutIndex,
}: UsePanelEditorSaveArgs): UsePanelEditorSaveApi {
	const queryClient = useQueryClient();
<<<<<<< HEAD
	const { mutateAsync, isLoading, error } = usePatchDashboardV2();

	const save = useCallback(
		async (spec: DashboardtypesPanelSpecDTO): Promise<void> => {
			const dashboardQueryKey = getGetDashboardV2QueryKey({ id: dashboardId });

			let ops: DashboardtypesJSONPatchOperationDTO[];
			if (isNew) {
				// Resolve the target section against the freshest dashboard we have.
=======
	const { patchAsync, isPatching, error } = useOptimisticPatch(dashboardId);

	const save = useCallback(
		async (spec: DashboardtypesPanelSpecDTO): Promise<void> => {
			let ops: DashboardtypesJSONPatchOperationDTO[];
			if (isNew) {
				// Resolve the target section against the freshest dashboard we have.
				const dashboardQueryKey = getGetDashboardV2QueryKey({ id: dashboardId });
>>>>>>> upstream/main
				const cached =
					queryClient.getQueryData<GetDashboardV2200>(dashboardQueryKey);
				ops = createPanelOps({
					layouts: cached?.data.spec.layouts ?? [],
					layoutIndex,
					panelId: uuid(),
					panel: { kind: DashboardtypesPanelKindDTO.Panel, spec },
				});
			} else {
				ops = [
					{
						op: DashboardtypesPatchOpDTO.add,
						path: `/spec/panels/${panelId}/spec`,
						value: spec,
					},
				];
			}

<<<<<<< HEAD
			await mutateAsync({ pathParams: { id: dashboardId }, data: ops });
			await queryClient.invalidateQueries(dashboardQueryKey);
		},
		[dashboardId, panelId, isNew, layoutIndex, mutateAsync, queryClient],
	);

	return { save, isSaving: isLoading, error: (error as Error) ?? null };
=======
			// Optimistic cache write + settle refetch (replaces the manual invalidate).
			await patchAsync(ops);
		},
		[dashboardId, panelId, isNew, layoutIndex, patchAsync, queryClient],
	);

	return { save, isSaving: isPatching, error };
>>>>>>> upstream/main
}
