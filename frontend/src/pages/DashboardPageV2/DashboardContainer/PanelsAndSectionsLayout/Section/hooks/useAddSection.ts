import { useCallback, useState } from 'react';

<<<<<<< HEAD
import { patchDashboardV2 } from 'api/generated/services/dashboard';
=======
>>>>>>> upstream/main
import type { DashboardtypesLayoutDTO } from 'api/generated/services/sigNoz.schemas';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

<<<<<<< HEAD
=======
import { useOptimisticPatch } from '../../../hooks/useOptimisticPatch';
>>>>>>> upstream/main
import {
	addSectionOp,
	newGridLayout,
	reorderLayoutsOp,
} from '../../../patchOps';
import { useDashboardStore } from '../../../store/useDashboardStore';

const SECTION_SELECTOR = '[data-testid^="dashboard-section-"]';

/**
<<<<<<< HEAD
 * Waits (via rAF) for the refetch to render the appended section, then scrolls
 * it into view. Polls because `refetch` resolves before React commits the new
 * section to the DOM; bails after ~40 frames.
=======
 * Waits (via rAF) for the appended section to render, then scrolls it into view.
 * Polls because the optimistic cache write commits to the DOM a frame or two after
 * the patch call; bails after ~40 frames.
>>>>>>> upstream/main
 */
function scrollToNewSection(prevCount: number, attempts = 40): void {
	const sections = document.querySelectorAll(SECTION_SELECTOR);
	if (sections.length > prevCount) {
		sections[sections.length - 1]?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
		return;
	}
	if (attempts > 0) {
		requestAnimationFrame(() => scrollToNewSection(prevCount, attempts - 1));
	}
}

interface Params {
	layouts: DashboardtypesLayoutDTO[] | undefined | null;
}

interface Result {
	addSection: (title: string) => Promise<void>;
	isSaving: boolean;
}

/**
 * Appends an empty titled section. When the dashboard has no layouts yet, the
 * layouts array is created via a `replace` (an `add` to a missing/empty array
 * pointer is unreliable); otherwise a new Grid is appended.
 */
export function useAddSection({ layouts }: Params): Result {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const [isSaving, setIsSaving] = useState(false);
	const { showErrorModal } = useErrorModal();

	const addSection = useCallback(
		async (title: string): Promise<void> => {
			const trimmed = title.trim();
			if (!dashboardId || !trimmed) {
				return;
			}
			const op =
				!layouts || layouts.length === 0
					? reorderLayoutsOp([newGridLayout(trimmed)])
					: addSectionOp(trimmed);
			const prevSectionCount = document.querySelectorAll(SECTION_SELECTOR).length;
			try {
				setIsSaving(true);
<<<<<<< HEAD
				await patchDashboardV2({ id: dashboardId }, [op]);
				refetch();
=======
				await patchAsync([op]);
>>>>>>> upstream/main
				scrollToNewSection(prevSectionCount);
			} catch (error) {
				showErrorModal(error as APIError);
			} finally {
				setIsSaving(false);
			}
		},
<<<<<<< HEAD
		[layouts, dashboardId, refetch, showErrorModal],
=======
		[layouts, dashboardId, patchAsync, showErrorModal],
>>>>>>> upstream/main
	);

	return { addSection, isSaving };
}
