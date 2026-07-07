import type { PanelDefinition } from '../../types/panelDefinition';
import Renderer from './Renderer';
import { sections } from './sections';
import { TelemetrytypesSignalDTO } from 'api/generated/services/sigNoz.schemas';
<<<<<<< HEAD
=======
import { EQueryType } from 'types/common/dashboard';
>>>>>>> upstream/main

export const definition: PanelDefinition<'signoz/PieChartPanel'> = {
	kind: 'signoz/PieChartPanel',
	displayName: 'Pie Chart',
	Renderer,
	sections,
	supportedSignals: [
		TelemetrytypesSignalDTO.metrics,
		TelemetrytypesSignalDTO.logs,
		TelemetrytypesSignalDTO.traces,
	],
<<<<<<< HEAD
=======
	supportedQueryTypes: [EQueryType.QUERY_BUILDER, EQueryType.CLICKHOUSE],
	queryBuilderFields: {},
>>>>>>> upstream/main
	actions: {
		view: true,
		edit: true,
		clone: true,
<<<<<<< HEAD
		download: false,
		createAlert: false,
		search: false,
=======
		download: { csv: false, png: true, svg: true },
		createAlert: false,
		search: false,
		drilldown: true,
>>>>>>> upstream/main
	},
};
