<<<<<<< HEAD
import type { ChartClickData } from 'lib/uPlotV2/plugins/TooltipPlugin/types';

import type { PanelKind } from './panelKind';

/** Source-tagged click events; each non-chart kind carries its own drill-down context. */
export type ChartClickEvent = ChartClickData;
export type TableClickEvent = {
	rowData: Record<string, unknown>;
	columnId?: string;
};
export type ListClickEvent = {
	rowData: Record<string, unknown>;
};
export type PieClickEvent = { label: string; value: number };

/** Union of every panel click event — switched on by `source` at the boundary. */
export type PanelClickEvent =
	| ChartClickEvent
	| TableClickEvent
	| ListClickEvent
	| PieClickEvent;

type DragSelect = (start: number, end: number) => void;

=======
import type { PanelKind } from './panelKind';
import type { DrilldownClickPayload } from './drilldown';

type DragSelect = (start: number, end: number) => void;

/** Close the standalone View modal — fired by the chart's graph-manager Save/Cancel. */
type CloseStandaloneView = () => void;

>>>>>>> upstream/main
/**
 * Per-kind interaction props — each kind exposes only the gestures it supports.
 * Keyed by `PanelKind`; `PanelRendererProps<K>` indexes this, so a missing kind
 * is a compile error there.
<<<<<<< HEAD
 */
export type PanelInteractionMap = Record<PanelKind, object> & {
	'signoz/TimeSeriesPanel': {
		onClick?: (event: ChartClickEvent) => void;
		onDragSelect?: DragSelect;
	};
	'signoz/BarChartPanel': {
		onClick?: (event: ChartClickEvent) => void;
		onDragSelect?: DragSelect;
	};
	'signoz/HistogramPanel': { onClick?: (event: ChartClickEvent) => void };
	'signoz/TablePanel': { onClick?: (event: TableClickEvent) => void };
	'signoz/ListPanel': { onClick?: (event: ListClickEvent) => void };
	'signoz/PieChartPanel': { onClick?: (event: PieClickEvent) => void };
	'signoz/NumberPanel': Record<string, never>;
=======
 *
 * Every interactive kind's `onClick` receives the unified `DrilldownClickPayload`
 * its renderer enriches from the native click. Number/Value drills down on its
 * single value. Histogram and List are omitted (V1 has no drill-down for either):
 * they inherit the empty `object` base, so their renderers get only base props
 * with no click gesture.
 */
export type PanelInteractionMap = Record<PanelKind, object> & {
	'signoz/TimeSeriesPanel': {
		onClick?: (event: DrilldownClickPayload) => void;
		onDragSelect?: DragSelect;
		onCloseStandaloneView?: CloseStandaloneView;
	};
	'signoz/BarChartPanel': {
		onClick?: (event: DrilldownClickPayload) => void;
		onDragSelect?: DragSelect;
		onCloseStandaloneView?: CloseStandaloneView;
	};
	'signoz/TablePanel': { onClick?: (event: DrilldownClickPayload) => void };
	'signoz/PieChartPanel': { onClick?: (event: DrilldownClickPayload) => void };
	'signoz/NumberPanel': { onClick?: (event: DrilldownClickPayload) => void };
>>>>>>> upstream/main
};

/**
 * Widest interaction surface — used where the kind isn't known statically (the
 * registry render boundary). The supertype the per-kind shapes are cast to once.
 */
export interface AnyPanelInteractionProps {
<<<<<<< HEAD
	onClick?: (event: PanelClickEvent) => void;
	onDragSelect?: DragSelect;
=======
	onClick?: (event: DrilldownClickPayload) => void;
	onDragSelect?: DragSelect;
	onCloseStandaloneView?: CloseStandaloneView;
>>>>>>> upstream/main
}
