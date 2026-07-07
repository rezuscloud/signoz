import { useCallback } from 'react';

<<<<<<< HEAD
import { patchDashboardV2 } from 'api/generated/services/dashboard';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

=======
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

import { useOptimisticPatch } from '../../../hooks/useOptimisticPatch';
>>>>>>> upstream/main
import { removePanelOp, replaceSectionItemsOp } from '../../../patchOps';
import { useDashboardStore } from '../../../store/useDashboardStore';
import type { DashboardSection } from '../../../utils';

interface Params {
	sections: DashboardSection[];
}

export interface DeletePanelArgs {
	panelId: string;
	layoutIndex: number;
}

/**
 * Removes a panel: drops its item ref from the section's items and deletes the
 * panel from `spec.panels`, as one atomic patch.
 */
export function useDeletePanel({
	sections,
}: Params): (args: DeletePanelArgs) => Promise<void> {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const { showErrorModal } = useErrorModal();

	return useCallback(
		async ({ panelId, layoutIndex }: DeletePanelArgs): Promise<void> => {
			if (!dashboardId) {
				return;
			}
			const section = sections.find((s) => s.layoutIndex === layoutIndex);
			if (!section) {
				return;
			}

			const nextItems = section.items.filter((i) => i.id !== panelId);
			try {
<<<<<<< HEAD
				await patchDashboardV2({ id: dashboardId }, [
					replaceSectionItemsOp(layoutIndex, nextItems),
					removePanelOp(panelId),
				]);
				refetch();
=======
				await patchAsync([
					replaceSectionItemsOp(layoutIndex, nextItems),
					removePanelOp(panelId),
				]);
>>>>>>> upstream/main
			} catch (error) {
				showErrorModal(error as APIError);
			}
		},
<<<<<<< HEAD
		[sections, dashboardId, refetch, showErrorModal],
=======
		[sections, dashboardId, patchAsync, showErrorModal],
>>>>>>> upstream/main
	);
}
