import { useCallback, useMemo } from 'react';
<<<<<<< HEAD
import {
	Bell,
	CloudDownload,
	Copy,
	FolderInput,
	Fullscreen,
	PenLine,
	Trash2,
} from '@signozhq/icons';
import type { MenuItem } from '@signozhq/ui/dropdown-menu';
=======
import { Bell, Copy, Fullscreen, PenLine, Trash2 } from '@signozhq/icons';
import type { MenuItem } from '@signozhq/ui/dropdown-menu';
import type { DashboardtypesPanelDTO } from 'api/generated/services/sigNoz.schemas';
>>>>>>> upstream/main
import useComponentPermission from 'hooks/useComponentPermission';
import {
	type ConfirmableAction,
	useConfirmableAction,
} from 'hooks/useConfirmableAction';
import { getPanelDefinition } from 'pages/DashboardPageV2/DashboardContainer/Panels/registry';
import { useOpenPanelEditor } from 'pages/DashboardPageV2/DashboardContainer/hooks/useOpenPanelEditor';
<<<<<<< HEAD
=======
import type { PanelQueryData } from 'pages/DashboardPageV2/DashboardContainer/queryV5/types';
>>>>>>> upstream/main
import { useDashboardStore } from 'pages/DashboardPageV2/DashboardContainer/store/useDashboardStore';
import { useAppContext } from 'providers/App/App';

import type { DashboardSection } from '../../../utils';
import type { PanelActionsConfig } from '../Panel';
import { useClonePanel } from '../hooks/useClonePanel';
<<<<<<< HEAD
import { useDeletePanel } from '../hooks/useDeletePanel';
import { useMovePanelToSection } from '../hooks/useMovePanelToSection';
import { PANEL_ACTION_META } from './panelActionMeta';
import { PanelKind } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/panelKind';
=======
import { useCreateAlertFromPanel } from '../hooks/useCreateAlertFromPanel';
import { useDeletePanel } from '../hooks/useDeletePanel';
import { useDownloadPanelMenuItem } from '../hooks/useDownloadPanelMenuItem';
import { useMovePanelToSection } from '../hooks/useMovePanelToSection';
import { useViewPanel } from '../hooks/useViewPanel';
import { buildMoveItems } from '../utils/buildMoveItems';
import { PANEL_ACTION_META } from './panelActionMeta';
>>>>>>> upstream/main

// Stable fallback so renders without layout context don't churn the mutation
// hooks' deps (a fresh [] each render would re-create their callbacks).
const EMPTY_SECTIONS: DashboardSection[] = [];

<<<<<<< HEAD
/** Placeholder for V1-parity actions whose V2 implementations land later. */
function notImplementedYet(feature: string): void {
	// eslint-disable-next-line no-alert -- temporary placeholder, see above
	alert(`${feature} option clicked`);
}

interface UsePanelActionItemsArgs {
	panelId: string;
	/** Full plugin kind (e.g. `signoz/TimeSeriesPanel`); */
	panelKind: PanelKind;
=======
interface UsePanelActionItemsArgs {
	panelId: string;
	/** The panel itself — seeds "Create Alerts" and the download filename. */
	panel: DashboardtypesPanelDTO;
	/** The panel's query response — the source for "Download as CSV". */
	data: PanelQueryData;
>>>>>>> upstream/main
	/** Layout context for move/delete — absent outside editable mode. */
	panelActions?: PanelActionsConfig;
}

export interface PanelActionItems {
	items: MenuItem[];
	/** Two-step confirm flow for the destructive Delete action. */
	deleteConfirm: ConfirmableAction;
}

/**
<<<<<<< HEAD
 * Resolves the panel actions menu items (V1 WidgetHeader set plus V2's "Move to
 * section"). Every action passes three gates before it appears:
 *
 *   kind — what the panel kind declares it supports (PanelDefinition.actions);
 *          unknown kinds support no kind-gated actions.
 *   role — componentPermission lookup for the current user (PANEL_ACTION_META;
 *          actions without a permission key are open to every role, V1 parity).
 *   context — runtime state: dashboard editable (store), layout config present.
 *          View and Download remain available on read-only dashboards, as in V1.
 */
export function usePanelActionItems({
	panelId,
	panelKind,
	panelActions,
}: UsePanelActionItemsArgs): PanelActionItems {
=======
 * Resolves the panel actions menu items. Each action passes three gates before
 * it appears: kind (PanelDefinition.actions), role (useComponentPermission) and
 * context (dashboard editable + layout config present). View and Download stay
 * available on read-only dashboards, as in V1.
 */
export function usePanelActionItems({
	panelId,
	panel,
	data,
	panelActions,
}: UsePanelActionItemsArgs): PanelActionItems {
	const panelKind = panel.spec.plugin.kind;
>>>>>>> upstream/main
	const { user } = useAppContext();
	const [canEditWidget, canMove, canDelete] = useComponentPermission(
		[
			// edit_widget gates both Edit and Clone, exactly as in V1.
			PANEL_ACTION_META.edit.permission ?? 'edit_widget',
			PANEL_ACTION_META.move.permission ?? 'edit_dashboard',
			PANEL_ACTION_META.delete.permission ?? 'delete_widget',
		],
		user.role,
	);
	const isEditable = useDashboardStore((s) => s.isEditable);
	const openPanelEditor = useOpenPanelEditor();
<<<<<<< HEAD

	// Mutations are store-backed (dashboardId/refetch) — the layout tree only
	// supplies data (`sections`), so no callbacks are threaded through it.
=======
	const createAlert = useCreateAlertFromPanel();
	const { openView } = useViewPanel();

	// Mutations are store-backed; the layout tree only supplies `sections`.
>>>>>>> upstream/main
	const sections = panelActions?.sections ?? EMPTY_SECTIONS;
	const movePanel = useMovePanelToSection({ sections });
	const deletePanel = useDeletePanel({ sections });
	const clonePanel = useClonePanel({ sections });

<<<<<<< HEAD
	const kindActions = getPanelDefinition(panelKind)?.actions;
=======
	const panelCapabilities = getPanelDefinition(panelKind).actions;
	const downloadItem = useDownloadPanelMenuItem({
		panelId,
		panel,
		data,
		actions: panelCapabilities,
	});
>>>>>>> upstream/main

	// Delete runs on confirm, not on click — the menu item opens a prompt.
	const deleteConfirm = useConfirmableAction(
		useCallback(async (): Promise<void> => {
			if (!panelActions) {
				return;
			}
			await deletePanel({
				panelId,
				layoutIndex: panelActions.currentLayoutIndex,
			});
		}, [deletePanel, panelActions, panelId]),
	);
	// Stable opener so the items memo doesn't rebuild on dialog state changes.
	const { request: requestDelete } = deleteConfirm;

	const items = useMemo<MenuItem[]>(() => {
		const panelGroup: MenuItem[] = [];
<<<<<<< HEAD
		if (kindActions?.view) {
=======
		if (panelCapabilities.view) {
>>>>>>> upstream/main
			panelGroup.push({
				key: 'view-panel',
				label: 'View',
				icon: <Fullscreen size={14} />,
<<<<<<< HEAD
				onClick: (): void => notImplementedYet('View'),
			});
		}
		if (isEditable && canEditWidget && kindActions?.edit) {
=======
				onClick: (): void => openView(panelId),
			});
		}
		if (isEditable && canEditWidget && panelCapabilities.edit) {
>>>>>>> upstream/main
			panelGroup.push({
				key: 'edit-panel',
				label: 'Edit panel',
				icon: <PenLine size={14} />,
				onClick: (): void => openPanelEditor(panelId),
			});
		}
<<<<<<< HEAD
		// Clone needs the section context (source spec + dimensions) to place the
		// copy, so — unlike Edit — it requires panelActions.
		if (isEditable && canEditWidget && panelActions && kindActions?.clone) {
=======
		// Clone needs the section context to place the copy, so — unlike Edit —
		// it requires panelActions.
		if (isEditable && canEditWidget && panelActions && panelCapabilities.clone) {
>>>>>>> upstream/main
			panelGroup.push({
				key: 'clone-panel',
				label: 'Clone',
				icon: <Copy size={14} />,
				onClick: (): void =>
					void clonePanel({
						panelId,
						layoutIndex: panelActions.currentLayoutIndex,
					}),
			});
		}

		const dataGroup: MenuItem[] = [];
<<<<<<< HEAD
		if (kindActions?.download) {
			dataGroup.push({
				key: 'download-panel',
				label: 'Download as CSV',
				icon: <CloudDownload size={14} />,
				onClick: (): void => notImplementedYet('Download'),
			});
		}
		if (isEditable && kindActions?.createAlert) {
=======
		if (downloadItem) {
			dataGroup.push(downloadItem);
		}

		// Create Alerts opens a new tab and never mutates the dashboard, so —
		// unlike edit/clone — it isn't gated on `isEditable` (V1 parity).
		if (panelCapabilities.createAlert) {
>>>>>>> upstream/main
			dataGroup.push({
				key: 'create-alert',
				label: 'Create Alerts',
				icon: <Bell size={14} />,
<<<<<<< HEAD
				onClick: (): void => notImplementedYet('Create Alerts'),
			});
		}

		const moveGroup: MenuItem[] = [];
		if (canMove && panelActions) {
			const targets = sections.filter(
				(s) => s.title && s.layoutIndex !== panelActions.currentLayoutIndex,
			);
			moveGroup.push({
				key: 'move',
				label: 'Move to section',
				icon: <FolderInput size={14} />,
				...(targets.length === 0
					? { disabled: true }
					: {
							children: targets.map((s) => ({
								key: `move-${s.layoutIndex}`,
								label: s.title,
								onClick: (): void =>
									void movePanel({
										panelId,
										fromLayoutIndex: panelActions.currentLayoutIndex,
										toLayoutIndex: s.layoutIndex,
									}),
							})),
						}),
			});
		}
=======
				onClick: (): void => createAlert(panel, panelId),
			});
		}

		const moveGroup: MenuItem[] =
			canMove && panelActions
				? buildMoveItems({
						sections,
						currentLayoutIndex: panelActions.currentLayoutIndex,
						panelId,
						movePanel,
					})
				: [];
>>>>>>> upstream/main

		const deleteGroup: MenuItem[] =
			canDelete && panelActions
				? [
						{
							key: 'delete-panel',
							danger: true,
							icon: <Trash2 size={14} />,
							label: 'Delete panel',
							onClick: (): void => requestDelete(),
						},
					]
				: [];

		return [panelGroup, dataGroup, moveGroup, deleteGroup]
			.filter((group) => group.length > 0)
			.flatMap((group, index) =>
				index === 0 ? group : [{ type: 'divider' as const }, ...group],
			);
	}, [
		isEditable,
		canEditWidget,
		canMove,
		canDelete,
<<<<<<< HEAD
		kindActions,
		panelActions,
		sections,
		panelId,
		openPanelEditor,
=======
		panelCapabilities,
		panel,
		panelActions,
		sections,
		panelId,
		downloadItem,
		openView,
		openPanelEditor,
		createAlert,
>>>>>>> upstream/main
		movePanel,
		clonePanel,
		requestDelete,
	]);

	return { items, deleteConfirm };
}
