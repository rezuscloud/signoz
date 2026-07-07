import { useCallback, useState } from 'react';
<<<<<<< HEAD
import { patchDashboardV2 } from 'api/generated/services/dashboard';
=======
>>>>>>> upstream/main
import { toast } from '@signozhq/ui/sonner';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

<<<<<<< HEAD
=======
import { useOptimisticPatch } from '../../hooks/useOptimisticPatch';
>>>>>>> upstream/main
import { useDashboardStore } from '../../store/useDashboardStore';
import { formModelToDto } from './variableAdapters';
import type { VariableFormModel } from './variableFormModel';
import { buildVariablesPatch } from './variablePatchOps';

interface UseSaveVariables {
	save: (variables: VariableFormModel[]) => Promise<boolean>;
	isSaving: boolean;
}

<<<<<<< HEAD
/**
 * Persists the dashboard's variable list via a single `/spec/variables` patch,
 * then refetches. Mirrors the General-settings save flow (patch → toast →
 * refetch → surface errors).
 */
export function useSaveVariables(): UseSaveVariables {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
	const refetch = useDashboardStore((s) => s.refetch);
=======
export function useSaveVariables(): UseSaveVariables {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const { showErrorModal } = useErrorModal();
	const [isSaving, setIsSaving] = useState(false);

	const save = useCallback(
		async (variables: VariableFormModel[]): Promise<boolean> => {
			if (!dashboardId) {
				return false;
			}
			const dtos = variables.map(formModelToDto);
			try {
				setIsSaving(true);
<<<<<<< HEAD
				await patchDashboardV2({ id: dashboardId }, buildVariablesPatch(dtos));
				toast.success('Variables updated');
				refetch();
=======
				await patchAsync(buildVariablesPatch(dtos));
				toast.success('Variables updated');
>>>>>>> upstream/main
				return true;
			} catch (error) {
				showErrorModal(error as APIError);
				return false;
			} finally {
				setIsSaving(false);
			}
		},
<<<<<<< HEAD
		[dashboardId, refetch, showErrorModal],
=======
		[dashboardId, patchAsync, showErrorModal],
>>>>>>> upstream/main
	);

	return { save, isSaving };
}
