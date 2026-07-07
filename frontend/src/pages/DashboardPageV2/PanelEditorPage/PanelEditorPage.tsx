import { useCallback, useMemo } from 'react';
import {
	generatePath,
	Redirect,
	useLocation,
	useParams,
} from 'react-router-dom';
import { Typography } from '@signozhq/ui/typography';
<<<<<<< HEAD
import { useGetDashboardV2 } from 'api/generated/services/dashboard';
=======
>>>>>>> upstream/main
import Spinner from 'components/Spinner';
import { QueryParams } from 'constants/query';
import ROUTES from 'constants/routes';
import { useSafeNavigate } from 'hooks/useSafeNavigate';

<<<<<<< HEAD
import { getPanelDefinition } from '../DashboardContainer/Panels/registry';
import { buildDefaultPluginSpec } from '../DashboardContainer/Panels/utils/buildDefaultPluginSpec';
import { buildDefaultQueries } from '../DashboardContainer/Panels/utils/buildDefaultQueries';
import PanelEditorContainer from '../DashboardContainer/PanelEditor';
=======
import { useDashboardFetch } from '../DashboardContainer/hooks/useDashboardFetch';
import { getPanelDefinition } from '../DashboardContainer/Panels/registry';
import { buildPluginSpec } from '../DashboardContainer/Panels/utils/buildPluginSpec';
import { buildDefaultQueries } from '../DashboardContainer/Panels/utils/buildDefaultQueries';
import PanelEditorContainer from '../DashboardContainer/PanelEditor';
import type { PanelEditorHandoffState } from '../DashboardContainer/PanelEditor/panelEditorHandoff';
>>>>>>> upstream/main
import {
	parseNewPanelKind,
	parseNewPanelLayoutIndex,
} from '../DashboardContainer/PanelEditor/newPanelRoute';
<<<<<<< HEAD
=======
import { useSyncVariablesForSuggestions } from '../DashboardContainer/hooks/useSyncVariablesForSuggestions';
>>>>>>> upstream/main
import { createDefaultPanel } from '../DashboardContainer/patchOps';
import styles from './PanelEditorPage.module.scss';

/**
 * Full-page route for editing a V2 dashboard panel. Resolves the panel from the
 * fetched dashboard spec and wires up navigate-back callbacks.
 */
function PanelEditorPage(): JSX.Element {
	const { dashboardId, panelId } = useParams<{
		dashboardId: string;
		panelId: string;
	}>();
<<<<<<< HEAD
	const { search } = useLocation();
	const { safeNavigate } = useSafeNavigate();

	const { data, isLoading, isError, error } = useGetDashboardV2({
		id: dashboardId,
	});
	const dashboard = data?.data;
=======
	const { search, state } = useLocation();
	const { safeNavigate } = useSafeNavigate();

	// Edits handed off from the View modal's drilldown — open the editor on these
	// instead of the saved panel. Lost on refresh/new-tab, which falls back to saved.
	const handoffSpec = (state as PanelEditorHandoffState | null)?.editSpec;

	const { dashboard, isLoading, isError, error } =
		useDashboardFetch(dashboardId);

	// Feed variables to the query builder autocomplete inside the editor.
	useSyncVariablesForSuggestions(dashboard);
>>>>>>> upstream/main

	// A `panel/new?panelKind=…` route means "create": seed a default panel of that
	// kind rather than looking one up. Persisted (with a real id) only on save.
	const newKind = parseNewPanelKind(panelId, search);
	const existingPanel = dashboard?.spec.panels[panelId];
<<<<<<< HEAD
	const panel = useMemo(
		() =>
			newKind
				? createDefaultPanel(
						newKind,
						buildDefaultPluginSpec(getPanelDefinition(newKind)?.sections ?? []),
						buildDefaultQueries(newKind),
					)
				: existingPanel,
		[newKind, existingPanel],
	);
=======
	const panel = useMemo(() => {
		if (newKind) {
			return createDefaultPanel(
				newKind,
				buildPluginSpec(getPanelDefinition(newKind).sections),
				buildDefaultQueries(newKind),
			);
		}
		if (!existingPanel) {
			return undefined;
		}
		// Open on the modal's drilldown edits when handed off; else the saved panel.
		return handoffSpec ? { ...existingPanel, spec: handoffSpec } : existingPanel;
	}, [newKind, existingPanel, handoffSpec]);
>>>>>>> upstream/main

	// Target section for a newly-created panel (set by the "Add panel" trigger).
	const layoutIndex = parseNewPanelLayoutIndex(search);

	const backToDashboard = useCallback((): void => {
		// Carry only dashboard params; drop editor-only URL state (chiefly
		// `compositeQuery`) so it doesn't leak into the dashboard. Time lives in Redux.
		const params = new URLSearchParams();
		const variables = new URLSearchParams(search).get(QueryParams.variables);
		if (variables) {
			params.set(QueryParams.variables, variables);
		}
		const query = params.toString();
		safeNavigate(
			`${generatePath(ROUTES.DASHBOARD, { dashboardId })}${
				query ? `?${query}` : ''
			}`,
		);
	}, [safeNavigate, dashboardId, search]);

	if (isLoading) {
		return <Spinner tip="Loading dashboard..." />;
	}

	if (isError || !dashboard) {
		return (
			<div className={styles.errorState}>
				<Typography.Title>Failed to load dashboard</Typography.Title>
				<Typography.Text>{(error as Error)?.message}</Typography.Text>
			</div>
		);
	}

	// No panel (stale/deleted id, or unknown new-panel kind) — send the user back.
	if (!panel) {
		return (
			<Redirect
				to={`${generatePath(ROUTES.DASHBOARD, { dashboardId })}${search}`}
			/>
		);
	}

	return (
		<PanelEditorContainer
			dashboardId={dashboardId}
			panelId={panelId}
			panel={panel}
			isNew={!!newKind}
			layoutIndex={layoutIndex}
			onClose={backToDashboard}
			onSaved={backToDashboard}
		/>
	);
}

export default PanelEditorPage;
