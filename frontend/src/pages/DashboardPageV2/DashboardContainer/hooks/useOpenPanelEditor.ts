import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import ROUTES from 'constants/routes';
import { useSafeNavigate } from 'hooks/useSafeNavigate';

<<<<<<< HEAD
=======
import type { PanelEditorHandoffState } from '../PanelEditor/panelEditorHandoff';
>>>>>>> upstream/main
import { useDashboardStore } from '../store/useDashboardStore';

/**
 * Returns a callback that opens the V2 panel editor by navigating to its full-page route
 * (`/dashboard/:dashboardId/panel/:panelId`). The dashboard id comes from the store, so any
<<<<<<< HEAD
 * caller can open the editor with just the panel id.
 */
export function useOpenPanelEditor(): (panelId: string) => void {
=======
 * caller can open the editor with just the panel id. The optional `handoffState` is passed as
 * router location state — the View modal uses it to hand its drilldown-edited spec off to the
 * editor (view → edit) so the editor opens on those edits rather than the saved panel.
 */
export function useOpenPanelEditor(): (
	panelId: string,
	handoffState?: PanelEditorHandoffState,
) => void {
>>>>>>> upstream/main
	const { safeNavigate } = useSafeNavigate();
	const dashboardId = useDashboardStore((s) => s.dashboardId);

	return useCallback(
<<<<<<< HEAD
		(panelId: string): void => {
			safeNavigate(
				generatePath(ROUTES.DASHBOARD_PANEL_EDITOR, { dashboardId, panelId }),
=======
		(panelId: string, handoffState?: PanelEditorHandoffState): void => {
			safeNavigate(
				generatePath(ROUTES.DASHBOARD_PANEL_EDITOR, { dashboardId, panelId }),
				handoffState ? { state: handoffState } : undefined,
>>>>>>> upstream/main
			);
		},
		[safeNavigate, dashboardId],
	);
}
