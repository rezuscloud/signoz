import { useCallback, useState } from 'react';

<<<<<<< HEAD
import { patchDashboardV2 } from 'api/generated/services/dashboard';
=======
>>>>>>> upstream/main
import type { DashboardtypesJSONPatchOperationDTO } from 'api/generated/services/sigNoz.schemas';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

<<<<<<< HEAD
=======
import { useOptimisticPatch } from '../../../hooks/useOptimisticPatch';
>>>>>>> upstream/main
import { removePanelOp, removeSectionOp } from '../../../patchOps';
import { useDashboardStore } from '../../../store/useDashboardStore';
import type { DashboardSection } from '../../../utils';

interface Params {
	section: DashboardSection;
}

interface Result {
	deleteSection: () => Promise<void>;
	isSaving: boolean;
}

/**
 * Deletes a section: removes its Grid layout and deletes every panel it
 * contained from `spec.panels` (orphan cleanup), as one atomic patch.
 */
export function useDeleteSection({ section }: Params): Result {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const [isSaving, setIsSaving] = useState(false);
	const { showErrorModal } = useErrorModal();

	const deleteSection = useCallback(async (): Promise<void> => {
		if (!dashboardId) {
			return;
		}
		const ops: DashboardtypesJSONPatchOperationDTO[] = section.items.map((i) =>
			removePanelOp(i.id),
		);
		ops.push(removeSectionOp(section.layoutIndex));
		try {
			setIsSaving(true);
<<<<<<< HEAD
			await patchDashboardV2({ id: dashboardId }, ops);
			refetch();
=======
			await patchAsync(ops);
>>>>>>> upstream/main
		} catch (error) {
			showErrorModal(error as APIError);
		} finally {
			setIsSaving(false);
		}
<<<<<<< HEAD
	}, [section, dashboardId, refetch, showErrorModal]);
=======
	}, [section, dashboardId, patchAsync, showErrorModal]);
>>>>>>> upstream/main

	return { deleteSection, isSaving };
}
