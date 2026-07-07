import { useCallback } from 'react';
import { toast } from '@signozhq/ui/sonner';
import { cloneDeep } from 'lodash-es';
import { v4 as uuid } from 'uuid';

<<<<<<< HEAD
import { patchDashboardV2 } from 'api/generated/services/dashboard';

import { addPanelToSectionOps, panelRef } from '../../../patchOps';
=======
import { useOptimisticPatch } from '../../../hooks/useOptimisticPatch';
import {
	addPanelToSectionOps,
	findFreeSlot,
	panelRef,
} from '../../../patchOps';
>>>>>>> upstream/main
import { useDashboardStore } from '../../../store/useDashboardStore';
import type { DashboardSection } from '../../../utils';

interface Params {
	sections: DashboardSection[];
}

export interface ClonePanelArgs {
	panelId: string;
	layoutIndex: number;
}

/**
 * Duplicates a panel: deep-copies the source spec under a fresh id and drops a
<<<<<<< HEAD
 * same-size grid item at the bottom of the section, as one atomic patch. Mirrors
 * V1's clone (verbatim spec copy, no rename).
=======
 * same-size grid item into the section via `findFreeSlot` (beside the last row
 * if it fits, else a fresh row), as one atomic patch. Mirrors V1's clone
 * (verbatim spec copy, no rename).
>>>>>>> upstream/main
 */
export function useClonePanel({
	sections,
}: Params): (args: ClonePanelArgs) => Promise<void> {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main

	return useCallback(
		async ({ panelId, layoutIndex }: ClonePanelArgs): Promise<void> => {
			const section = sections.find((s) => s.layoutIndex === layoutIndex);
			const source = section?.items.find((i) => i.id === panelId);
			if (!dashboardId || !section || !source?.panel) {
				return;
			}

			const newPanelId = uuid();
<<<<<<< HEAD
			const nextY = section.items.reduce(
				(max, i) => Math.max(max, i.y + i.height),
				0,
			);

			const clone = patchDashboardV2(
				{ id: dashboardId },
=======
			const { x, y } = findFreeSlot(section.items, source.width);

			const clone = patchAsync(
>>>>>>> upstream/main
				addPanelToSectionOps({
					panelId: newPanelId,
					panel: cloneDeep(source.panel),
					layoutIndex,
					item: {
<<<<<<< HEAD
						x: 0,
						y: nextY,
=======
						x,
						y,
>>>>>>> upstream/main
						width: source.width,
						height: source.height,
						content: { $ref: panelRef(newPanelId) },
					},
				}),
			);

			toast.promise(clone, {
				loading: 'Cloning panel…',
				success: 'Panel cloned',
				error: 'Failed to clone panel',
				position: 'top-center',
			});

<<<<<<< HEAD
			// Refetch only on success; toast.promise owns the error UX, so swallow
			// the rejection to avoid an unhandled rejection.
			try {
				await clone;
				refetch();
=======
			// toast.promise owns the error UX; swallow here to avoid an unhandled
			// rejection (the optimistic cache write + settle refetch handle state).
			try {
				await clone;
>>>>>>> upstream/main
			} catch {
				// no-op
			}
		},
<<<<<<< HEAD
		[sections, dashboardId, refetch],
=======
		[sections, dashboardId, patchAsync],
>>>>>>> upstream/main
	);
}
