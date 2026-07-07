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
import { addSectionOp, titleUntitledSectionOp } from '../../../patchOps';
import { useDashboardStore } from '../../../store/useDashboardStore';
import type { DashboardSection } from '../../../utils';

interface Params {
	sections: DashboardSection[];
}

interface Result {
	migrate: (newSectionTitle: string) => Promise<void>;
	isSaving: boolean;
}

/**
 * Converts a free-flowing dashboard into a sectioned one: every existing
 * untitled layout that holds panels is titled in place ("Section 1", "Section
 * 2", …), then the brand-new section the user asked for is appended — all in one
 * atomic patch. Used once the user confirms the migration prompt.
 */
export function useFirstSectionMigration({ sections }: Params): Result {
	const dashboardId = useDashboardStore((s) => s.dashboardId);
<<<<<<< HEAD
	const refetch = useDashboardStore((s) => s.refetch);
=======
	const { patchAsync } = useOptimisticPatch();
>>>>>>> upstream/main
	const [isSaving, setIsSaving] = useState(false);
	const { showErrorModal } = useErrorModal();

	const migrate = useCallback(
		async (newSectionTitle: string): Promise<void> => {
			const trimmed = newSectionTitle.trim();
			if (!dashboardId || !trimmed) {
				return;
			}

			const ops: DashboardtypesJSONPatchOperationDTO[] = [];
			let counter = 1;
			sections.forEach((s) => {
				if (!s.title && s.items.length > 0) {
					ops.push(titleUntitledSectionOp(s.layoutIndex, `Section ${counter}`));
					counter += 1;
				}
			});
			ops.push(addSectionOp(trimmed));

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
		},
<<<<<<< HEAD
		[sections, dashboardId, refetch, showErrorModal],
=======
		[sections, dashboardId, patchAsync, showErrorModal],
>>>>>>> upstream/main
	);

	return { migrate, isSaving };
}
