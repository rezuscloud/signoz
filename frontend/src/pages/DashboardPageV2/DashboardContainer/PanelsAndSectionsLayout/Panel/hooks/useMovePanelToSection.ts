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
import { movePanelBetweenSectionsOps } from '../../../patchOps';
import { useDashboardStore } from '../../../store/useDashboardStore';
import type { DashboardSection } from '../../../utils';

export interface MovePanelArgs {
	panelId: string;
	fromLayoutIndex: number;
	toLayoutIndex: number;
}

interface Params {
	sections: DashboardSection[];
}

/**
 * Relocates a panel's item ref from one section to another. The panel itself
 * stays in `spec.panels`; only the grid item moves, dropped into a free row at
 * the bottom of the target section. Persisted as one atomic patch.
 */
export function useMovePanelToSection({
	sections,
}: Params): (args: MovePanelArgs) => Promise<void> {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const { showErrorModal } = useErrorModal();

	return useCallback(
		async ({
			panelId,
			fromLayoutIndex,
			toLayoutIndex,
		}: MovePanelArgs): Promise<void> => {
			if (!dashboardId || fromLayoutIndex === toLayoutIndex) {
				return;
			}

			const source = sections.find((s) => s.layoutIndex === fromLayoutIndex);
			const target = sections.find((s) => s.layoutIndex === toLayoutIndex);
			if (!source || !target) {
				return;
			}

			const moved = source.items.find((i) => i.id === panelId);
			if (!moved) {
				return;
			}

			const sourceItems = source.items.filter((i) => i.id !== panelId);
			// Place at a fresh row at the bottom of the target section.
			const nextY = target.items.reduce(
				(max, i) => Math.max(max, i.y + i.height),
				0,
			);
			const targetItems = [...target.items, { ...moved, x: 0, y: nextY }];

			try {
<<<<<<< HEAD
				await patchDashboardV2(
					{ id: dashboardId },
=======
				await patchAsync(
>>>>>>> upstream/main
					movePanelBetweenSectionsOps({
						sourceIndex: fromLayoutIndex,
						sourceItems,
						targetIndex: toLayoutIndex,
						targetItems,
					}),
				);
<<<<<<< HEAD
				refetch();
=======
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
