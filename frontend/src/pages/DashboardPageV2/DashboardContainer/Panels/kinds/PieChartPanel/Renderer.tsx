<<<<<<< HEAD
import { useCallback, useMemo } from 'react';
=======
import {
	useCallback,
	useMemo,
	type MouseEvent as ReactMouseEvent,
} from 'react';
>>>>>>> upstream/main
import type { DashboardtypesPieChartPanelSpecDTO } from 'api/generated/services/sigNoz.schemas';
import Pie from 'container/DashboardContainer/visualization/charts/Pie/Pie';
import type { PieSlice } from 'container/DashboardContainer/visualization/charts/types';
import { useIsDarkMode } from 'hooks/useDarkMode';
import { prepareScalarTables } from 'pages/DashboardPageV2/DashboardContainer/queryV5/prepareScalarTables';
import { getScalarResults } from 'pages/DashboardPageV2/DashboardContainer/queryV5/v5ResponseData';

import NoData from '../../components/NoData/NoData';
import PanelStyles from '../../panel.module.scss';
import { PanelRendererProps } from '../../types/rendererProps';
import {
	resolveDecimalPrecision,
	resolveLegendPosition,
} from '../../utils/chartAppearance/resolvers';
<<<<<<< HEAD
=======
import { enrichPieClick } from '../../utils/drilldown/enrichPieClick';
import { getBuilderQueries } from '../../utils/getBuilderQueries';
import { getPanelTimeRange } from '../../utils/getPanelTimeRange';
>>>>>>> upstream/main

import { preparePieData } from './prepareData';

function PiePanelRenderer({
	panelId,
	panel,
	data,
<<<<<<< HEAD
	refetch,
	onClick,
=======
	isFetching,
	refetch,
	onClick,
	enableDrillDown,
>>>>>>> upstream/main
}: PanelRendererProps<'signoz/PieChartPanel'>): JSX.Element {
	const isDarkMode = useIsDarkMode();

	const spec = useMemo<DashboardtypesPieChartPanelSpecDTO>(
		() => panel.spec.plugin.spec,
		[panel.spec.plugin.spec],
	);

<<<<<<< HEAD
=======
	const builderQueries = useMemo(
		() => getBuilderQueries(panel.spec.queries || []),
		[panel.spec.queries],
	);

>>>>>>> upstream/main
	const slices = useMemo(
		() =>
			preparePieData({
				tables: prepareScalarTables({
					results: getScalarResults(data.response),
					legendMap: data.legendMap ?? {},
					requestPayload: data.requestPayload,
				}),
				customColors: spec.legend?.customColors,
				isDarkMode,
			}),
		[
			data.response,
			data.legendMap,
			data.requestPayload,
			spec.legend?.customColors,
			isDarkMode,
		],
	);

	const decimalPrecision = useMemo(
		() => resolveDecimalPrecision(spec.formatting?.decimalPrecision),
		[spec.formatting?.decimalPrecision],
	);

	const legendPosition = useMemo(
		() => resolveLegendPosition(spec.legend?.position),
		[spec.legend?.position],
	);

	const handleSliceClick = useCallback(
<<<<<<< HEAD
		(slice: PieSlice) => {
			onClick?.({ label: slice.label, value: slice.value });
		},
		[onClick],
=======
		(slice: PieSlice, event: ReactMouseEvent): void => {
			if (!onClick) {
				return;
			}
			const payload = enrichPieClick({
				slice,
				builderQueries,
				coordinates: { x: event.clientX, y: event.clientY },
				timeRange: getPanelTimeRange(data.requestPayload),
			});
			if (payload) {
				onClick(payload);
			}
		},
		[onClick, builderQueries, data.requestPayload],
>>>>>>> upstream/main
	);

	return (
		<div data-testid="pie-panel-renderer" className={PanelStyles.panelContainer}>
			{slices.length === 0 ? (
<<<<<<< HEAD
				<NoData onRetry={refetch} />
=======
				<NoData isFetching={isFetching} onRetry={refetch} />
>>>>>>> upstream/main
			) : (
				<Pie
					data={slices}
					yAxisUnit={spec.formatting?.unit}
					decimalPrecision={decimalPrecision}
					isDarkMode={isDarkMode}
					position={legendPosition}
					id={panelId}
<<<<<<< HEAD
					onSliceClick={handleSliceClick}
=======
					onSliceClick={enableDrillDown ? handleSliceClick : undefined}
>>>>>>> upstream/main
					data-testid="pie-chart"
				/>
			)}
		</div>
	);
}

export default PiePanelRenderer;
