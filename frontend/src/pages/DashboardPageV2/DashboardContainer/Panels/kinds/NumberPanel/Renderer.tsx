<<<<<<< HEAD
import { useMemo } from 'react';
=======
import {
	useCallback,
	useMemo,
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
} from 'react';
>>>>>>> upstream/main
import type { DashboardtypesNumberPanelSpecDTO } from 'api/generated/services/sigNoz.schemas';
import { prepareScalarTables } from 'pages/DashboardPageV2/DashboardContainer/queryV5/prepareScalarTables';
import { getScalarResults } from 'pages/DashboardPageV2/DashboardContainer/queryV5/v5ResponseData';

import NoData from '../../components/NoData/NoData';
import PanelStyles from '../../panel.module.scss';
import { PanelRendererProps } from '../../types/rendererProps';
import { formatPanelValue } from '../../utils/formatPanelValue';
import { resolveDecimalPrecision } from '../../utils/chartAppearance/resolvers';
<<<<<<< HEAD
=======
import { enrichNumberClick } from '../../utils/drilldown/enrichNumberClick';
import { getBuilderQueries } from '../../utils/getBuilderQueries';
import { getPanelTimeRange } from '../../utils/getPanelTimeRange';
>>>>>>> upstream/main

import { prepareNumberData } from './prepareData';
import { mapNumberThresholds } from './utils';
import ValueDisplay from './components/ValueDisplay/ValueDisplay';

function NumberPanelRenderer({
	panel,
	data,
<<<<<<< HEAD
	refetch,
=======
	isFetching,
	refetch,
	onClick,
	enableDrillDown,
>>>>>>> upstream/main
}: PanelRendererProps<'signoz/NumberPanel'>): JSX.Element {
	const spec = useMemo<DashboardtypesNumberPanelSpecDTO>(
		() => panel.spec.plugin.spec,
		[panel.spec.plugin.spec],
	);

<<<<<<< HEAD
	const value = useMemo(
		() =>
			prepareNumberData(
				prepareScalarTables({
					results: getScalarResults(data.response),
					legendMap: data.legendMap ?? {},
					requestPayload: data.requestPayload,
				}),
			),
		[data.response, data.legendMap, data.requestPayload],
	);

=======
	const builderQueries = useMemo(
		() => getBuilderQueries(panel.spec.queries || []),
		[panel.spec.queries],
	);

	const tables = useMemo(
		() =>
			prepareScalarTables({
				results: getScalarResults(data.response),
				legendMap: data.legendMap ?? {},
				requestPayload: data.requestPayload,
			}),
		[data.response, data.legendMap, data.requestPayload],
	);

	const value = useMemo(() => prepareNumberData(tables), [tables]);

>>>>>>> upstream/main
	const thresholds = useMemo(
		() => mapNumberThresholds(spec.thresholds),
		[spec.thresholds],
	);

	const decimalPrecision = useMemo(
		() => resolveDecimalPrecision(spec.formatting?.decimalPrecision),
		[spec.formatting?.decimalPrecision],
	);

	const unit = spec.formatting?.unit;

	// Precision is applied regardless of whether a unit is set (see
	// `formatPanelValue`), so decimal-precision changes always take effect.
	const formattedValue = useMemo(
		() => (value === null ? '' : formatPanelValue(value, unit, decimalPrecision)),
		[value, unit, decimalPrecision],
	);

<<<<<<< HEAD
=======
	const openDrilldown = useCallback(
		(coordinates: { x: number; y: number }): void => {
			if (!onClick) {
				return;
			}
			const payload = enrichNumberClick({
				tables,
				builderQueries,
				coordinates,
				timeRange: getPanelTimeRange(data.requestPayload),
			});
			if (payload) {
				onClick(payload);
			}
		},
		[onClick, tables, data.requestPayload, builderQueries],
	);

	const handleClick = useCallback(
		(event: ReactMouseEvent<HTMLDivElement>): void =>
			openDrilldown({ x: event.clientX, y: event.clientY }),
		[openDrilldown],
	);

	const handleKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>): void => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				const rect = event.currentTarget.getBoundingClientRect();
				openDrilldown({
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
				});
			}
		},
		[openDrilldown],
	);

	// The whole panel is the value, so the container itself is the drill-down target.
	const isClickable = enableDrillDown && !!onClick && value !== null;

>>>>>>> upstream/main
	return (
		<div
			data-testid="number-panel-renderer"
			className={PanelStyles.panelContainer}
<<<<<<< HEAD
		>
			{value === null ? (
				<NoData data-testid="number-panel-no-data" onRetry={refetch} />
=======
			{...(isClickable
				? {
						role: 'button',
						tabIndex: 0,
						onClick: handleClick,
						onKeyDown: handleKeyDown,
						style: { cursor: 'pointer' },
					}
				: {})}
		>
			{value === null ? (
				<NoData
					data-testid="number-panel-no-data"
					isFetching={isFetching}
					onRetry={refetch}
				/>
>>>>>>> upstream/main
			) : (
				<ValueDisplay
					value={formattedValue}
					rawValue={value}
					thresholds={thresholds}
					unit={unit}
				/>
			)}
		</div>
	);
}

export default NumberPanelRenderer;
