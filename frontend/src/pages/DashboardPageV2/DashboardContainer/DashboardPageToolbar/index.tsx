<<<<<<< HEAD
import { useCallback, useMemo } from 'react';
=======
import { useCallback, useEffect, useMemo, useState } from 'react';
>>>>>>> upstream/main
import { FullScreenHandle } from 'react-full-screen';
import { toast } from '@signozhq/ui/sonner';
import logEvent from 'api/common/logEvent';
import {
	lockDashboardV2,
<<<<<<< HEAD
	patchDashboardV2,
=======
>>>>>>> upstream/main
	unlockDashboardV2,
} from 'api/generated/services/dashboard';
import type {
	DashboardtypesGettableDashboardV2DTO,
	DashboardtypesJSONPatchOperationDTO,
} from 'api/generated/services/sigNoz.schemas';
import { Base64Icons } from 'container/DashboardContainer/DashboardSettings/General/utils';
import DateTimeSelectionV2 from 'container/TopNav/DateTimeSelectionV2';
import { useAppContext } from 'providers/App/App';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';
<<<<<<< HEAD

import { useCreatePanel } from '../hooks/useCreatePanel';
=======
import { USER_ROLES } from 'types/roles';
import { getAbsoluteUrl } from 'utils/basePath';

import { useCreatePanel } from '../hooks/useCreatePanel';
import { useOptimisticPatch } from '../hooks/useOptimisticPatch';
import { usePublicDashboardMeta } from '../DashboardSettings/PublicDashboard/usePublicDashboardMeta';
>>>>>>> upstream/main
import PanelTypeSelectionModal from '../PanelsAndSectionsLayout/Panel/PanelTypeSelectionModal/PanelTypeSelectionModal';
import DashboardActions from './DashboardActions/DashboardActions';
import DashboardInfo from './DashboardInfo/DashboardInfo';
import { useEditableTitle } from './DashboardInfo/useEditableTitle';
import VariablesBar from '../VariablesBar/VariablesBar';

import styles from './DashboardPageToolbar.module.scss';

interface DashboardPageToolbarProps {
	dashboard: DashboardtypesGettableDashboardV2DTO;
	handle: FullScreenHandle;
	refetch: () => void;
}

function DashboardPageToolbar(props: DashboardPageToolbarProps): JSX.Element {
	const { dashboard, handle, refetch } = props;

	const id = dashboard.id;
<<<<<<< HEAD
	const isDashboardLocked = !!dashboard.locked;
=======

	// Session-local lock state: the toggle appears once locked and persists for the page.
	const [isDashboardLocked, setIsDashboardLocked] = useState(!!dashboard.locked);
	const [showLockToggle, setShowLockToggle] = useState(!!dashboard.locked);
	useEffect(() => {
		setIsDashboardLocked(!!dashboard.locked);
		setShowLockToggle(!!dashboard.locked);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dashboard.id]);
>>>>>>> upstream/main

	const title = dashboard.spec.display.name;
	const description = dashboard.spec.display.description ?? '';
	const image = dashboard.image || Base64Icons[0];
	const tags = useMemo(
		() =>
			(dashboard.tags ?? []).map((t) =>
				t.key === t.value ? t.key : `${t.key}:${t.value}`,
			),
		[dashboard.tags],
	);

	const { user } = useAppContext();
	const { showErrorModal } = useErrorModal();
<<<<<<< HEAD
	const { isPickerOpen, openPicker, closePicker, createPanel } =
		useCreatePanel();
=======
	const { patchAsync } = useOptimisticPatch();
	const {
		isPickerOpen,
		openPicker,
		closePicker,
		createPanel,
		targetLayoutIndex,
	} = useCreatePanel();
>>>>>>> upstream/main

	const isAuthor =
		!!user?.email && !!dashboard.createdBy && dashboard.createdBy === user.email;

<<<<<<< HEAD
=======
	// Author/admin can lock-unlock (mirrors the Actions menu gate); integration-owned
	// dashboards are never toggleable.
	const canToggleLock =
		(isAuthor || user.role === USER_ROLES.ADMIN) &&
		dashboard.createdBy !== 'integration';

	// Public-sharing meta (deduped react-query read); drives the header globe.
	const { isPublic, publicMeta } = usePublicDashboardMeta(id);
	const publicUrl = getAbsoluteUrl(publicMeta?.publicPath ?? '');

>>>>>>> upstream/main
	const handleLockDashboardToggle = useCallback(async (): Promise<void> => {
		if (!id) {
			return;
		}
<<<<<<< HEAD
		try {
			if (isDashboardLocked) {
				await unlockDashboardV2({ id });
				toast.success('Dashboard unlocked');
			} else {
				await lockDashboardV2({ id });
				toast.success('Dashboard locked');
			}
			refetch();
		} catch (error) {
=======
		const next = !isDashboardLocked;
		setIsDashboardLocked(next);
		if (next) {
			setShowLockToggle(true);
		}
		try {
			if (next) {
				await lockDashboardV2({ id });
				toast.success('Dashboard locked');
			} else {
				await unlockDashboardV2({ id });
				toast.success('Dashboard unlocked');
			}
			refetch();
		} catch (error) {
			setIsDashboardLocked(!next);
>>>>>>> upstream/main
			showErrorModal(error as APIError);
		}
	}, [id, isDashboardLocked, refetch, showErrorModal]);

	const onNameSave = useCallback(
		async (next: string): Promise<void> => {
			if (!id) {
				return;
			}
			try {
				const patch: DashboardtypesJSONPatchOperationDTO[] = [
					{
						op: 'replace' as DashboardtypesJSONPatchOperationDTO['op'],
						path: '/spec/display/name',
						value: next,
					},
				];
<<<<<<< HEAD
				await patchDashboardV2({ id }, patch);
				toast.success('Dashboard renamed successfully');
				refetch();
=======
				await patchAsync(patch);
				toast.success('Dashboard renamed successfully');
>>>>>>> upstream/main
			} catch (error) {
				showErrorModal(error as APIError);
			}
		},
<<<<<<< HEAD
		[id, refetch, showErrorModal],
=======
		[id, patchAsync, showErrorModal],
>>>>>>> upstream/main
	);

	const { isEditing, draft, setDraft, startEdit, cancel, commit } =
		useEditableTitle({
			value: title,
			onSave: onNameSave,
		});

	const onAddPanel = useCallback((): void => {
		void logEvent('Dashboard Detail V2: Add new panel clicked', {
			dashboardId: id,
		});
		openPicker();
	}, [id, openPicker]);

	return (
		<section className={styles.dashboardPageToolbarContainer}>
			<div className={styles.dashboardInfoWithActions}>
				<DashboardInfo
					title={title}
					image={image}
					tags={tags}
					description={description}
<<<<<<< HEAD
					isPublicDashboard={false}
					isDashboardLocked={isDashboardLocked}
=======
					isPublicDashboard={isPublic}
					publicUrl={publicUrl}
					isDashboardLocked={isDashboardLocked}
					showLockToggle={showLockToggle}
					onToggleLock={canToggleLock ? handleLockDashboardToggle : undefined}
>>>>>>> upstream/main
					isEditing={isEditing}
					draft={draft}
					onDraftChange={setDraft}
					onStartEdit={startEdit}
					onCommit={commit}
					onCancel={cancel}
				/>
				<DashboardActions
					title={title}
					dashboard={dashboard}
					handle={handle}
					isDashboardLocked={isDashboardLocked}
					isAuthor={isAuthor}
					onAddPanel={onAddPanel}
					onLockToggle={handleLockDashboardToggle}
					onOpenRename={startEdit}
				/>
			</div>

			{/* Row 2: the time selector floats top-right (declared first so the
			    variables bar's content wraps around it); the variables bar
			    collapses to one line and, when expanded, wraps full-width under it. */}
			<div className={styles.toolbarRow2}>
				<div className={styles.timeCluster}>
					<DateTimeSelectionV2 showAutoRefresh hideShareModal />
				</div>
				<VariablesBar dashboard={dashboard} />
			</div>
			<PanelTypeSelectionModal
				open={isPickerOpen}
				onClose={closePicker}
				onSelect={createPanel}
<<<<<<< HEAD
=======
				defaultLayoutIndex={targetLayoutIndex}
>>>>>>> upstream/main
			/>
		</section>
	);
}

export default DashboardPageToolbar;
