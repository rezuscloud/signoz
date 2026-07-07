<<<<<<< HEAD
import { Spin } from 'antd';
import { Loader, RotateCw, SquarePlus, TriangleAlert } from '@signozhq/icons';
import type { DashboardtypesPanelDTO } from 'api/generated/services/sigNoz.schemas';
import { PanelMode } from 'container/DashboardContainer/visualization/panels/types';
import PanelMessage from 'pages/DashboardPageV2/DashboardContainer/Panels/components/PanelMessage/PanelMessage';
import type { RenderablePanelDefinition } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/panelDefinition';
import type { DashboardPreference } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/rendererProps';
import { hasRunnableQueries } from 'pages/DashboardPageV2/DashboardContainer/queryV5/buildQueryRangeRequest';
=======
import { RotateCw, SquarePlus, TriangleAlert } from '@signozhq/icons';
import type { DashboardtypesPanelDTO } from 'api/generated/services/sigNoz.schemas';
import { PanelMode } from 'container/DashboardContainer/visualization/panels/types';
import PanelLoader from 'pages/DashboardPageV2/DashboardContainer/Panels/components/PanelLoader/PanelLoader';
import PanelMessage from 'pages/DashboardPageV2/DashboardContainer/Panels/components/PanelMessage/PanelMessage';
import type { AnyPanelInteractionProps } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/interactions';
import type { RenderablePanelDefinition } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/panelDefinition';
import type { DashboardPreference } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/rendererProps';
import { hasRunnableQueries } from 'pages/DashboardPageV2/DashboardContainer/queryV5/buildQueryRangeRequest';
import { getResponseType } from 'pages/DashboardPageV2/DashboardContainer/queryV5/v5ResponseData';
>>>>>>> upstream/main
import type {
	PanelPagination,
	PanelQueryData,
} from 'pages/DashboardPageV2/DashboardContainer/queryV5/types';

import { panelStatusFromError } from '../PanelStatus/utils';
import styles from './PanelBody.module.scss';

interface PanelBodyProps {
	/** Resolved renderer for the panel kind (`Panel` handles the unsupported case). */
	panelDefinition: RenderablePanelDefinition;
	panel: DashboardtypesPanelDTO;
	panelId: string;
	data: PanelQueryData;
	isFetching: boolean;
<<<<<<< HEAD
=======
	/** Showing a prior page's data while the next loads; forwarded so list renderers can show skeletons. */
	isPreviousData?: boolean;
>>>>>>> upstream/main
	error: Error | null;
	refetch: () => void;
	onDragSelect: (start: number, end: number) => void;
	/** Dashboard-wide preferences (cursor sync, …); absent in the editor preview. */
	dashboardPreference?: DashboardPreference;
	/** Render context — defaults to the dashboard view; the editor preview passes EDIT. */
	panelMode?: PanelMode;
	/** Header search term — only consumed by kinds that declare header search. */
	searchTerm?: string;
	/** Server-side paging handles — only consumed by raw/list renderers. */
	pagination?: PanelPagination;
<<<<<<< HEAD
=======
	/** Close the standalone View modal — only consumed by the time-series/bar graph manager. */
	onCloseStandaloneView?: () => void;
	/** Opens the drill-down context menu; threaded to interactive renderers. */
	onClick?: AnyPanelInteractionProps['onClick'];
	/** Gate for the drill-down menu — kind supported and the panel has a builder query. */
	enableDrillDown?: boolean;
>>>>>>> upstream/main
}

/**
 * Renders a panel's body as a state machine: not-configured / error+no-data /
 * first-load / renderer. The renderer keeps stale data mounted across refetches.
 */
function PanelBody({
	panelDefinition,
	panel,
	panelId,
	data,
	isFetching,
<<<<<<< HEAD
=======
	isPreviousData,
>>>>>>> upstream/main
	error,
	refetch,
	onDragSelect,
	dashboardPreference,
	panelMode = PanelMode.DASHBOARD_VIEW,
	searchTerm,
	pagination,
<<<<<<< HEAD
}: PanelBodyProps): JSX.Element {
	// react-query keeps the previous response during refetches, so its presence is
	// the "have something to show" signal — only fail hard when there's nothing.
	const hasData = !!data.response;
	const queries = panel.spec.queries || [];
=======
	onCloseStandaloneView,
	onClick,
	enableDrillDown = false,
}: PanelBodyProps): JSX.Element {
	// A retained response (keepPreviousData) counts as data only if its type matches the current
	// request — else a prior panel kind's response (time_series → raw) flashes NoData on switch.
	const hasData =
		!!data.response &&
		getResponseType(data.response) === data.requestPayload?.requestType;
	const queries = panel.spec.queries;
>>>>>>> upstream/main

	// Not-configured panel: no runnable query, so nothing to error/load on.
	if (!hasRunnableQueries(queries)) {
		return (
			<PanelMessage
				icon={<SquarePlus size={18} />}
				title="Nothing to visualize yet"
				description="This panel has no query. Add one to start plotting data."
				data-testid="panel-no-query"
			/>
		);
	}

	if (error && !hasData) {
		// Parse the API error (as the header popover does) to show the backend
		// message, not the raw axios "status code 4xx".
		const errorDetail = panelStatusFromError(error);
		return (
			<PanelMessage
				icon={<TriangleAlert size={18} />}
				tone="danger"
				title="Couldn’t load panel data"
				description={errorDetail?.message || 'Something went wrong while fetching.'}
				action={{
					label: 'Retry',
					onClick: refetch,
					icon: <RotateCw size={14} />,
				}}
				data-testid="panel-error"
			/>
		);
	}

<<<<<<< HEAD
	if (isFetching) {
		return (
			<div className={styles.body} data-testid="panel-loading">
				<Spin indicator={<Loader size={14} className="animate-spin" />} />
			</div>
		);
	}

	return (
		<div className={styles.chartContainer}>
=======
	// Full-panel loader only on first fetch; a refetch over existing data keeps the renderer
	// mounted (e.g. list page change). A refetch over empty data loads via NoData.
	if (isFetching && !hasData) {
		return <PanelLoader />;
	}

	return (
		<div className={styles.panelContainer}>
>>>>>>> upstream/main
			<panelDefinition.Renderer
				panelId={panelId}
				panel={panel}
				data={data}
				isFetching={isFetching}
<<<<<<< HEAD
=======
				isPreviousData={isPreviousData}
>>>>>>> upstream/main
				error={error}
				refetch={refetch}
				onDragSelect={onDragSelect}
				panelMode={panelMode}
<<<<<<< HEAD
				enableDrillDown={false}
				dashboardPreference={dashboardPreference}
				searchTerm={searchTerm}
				pagination={pagination}
=======
				enableDrillDown={enableDrillDown}
				onClick={onClick}
				dashboardPreference={dashboardPreference}
				searchTerm={searchTerm}
				pagination={pagination}
				onCloseStandaloneView={onCloseStandaloneView}
>>>>>>> upstream/main
			/>
		</div>
	);
}

export default PanelBody;
