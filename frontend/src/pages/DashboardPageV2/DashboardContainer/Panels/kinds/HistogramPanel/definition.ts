import type { PanelDefinition } from '../../types/panelDefinition';
import Renderer from './Renderer';
import { sections } from './sections';
import { TelemetrytypesSignalDTO } from 'api/generated/services/sigNoz.schemas';
<<<<<<< HEAD
=======
import { EQueryType } from 'types/common/dashboard';
>>>>>>> upstream/main

export const definition: PanelDefinition<'signoz/HistogramPanel'> = {
	kind: 'signoz/HistogramPanel',
	displayName: 'Histogram',
	Renderer,
	sections,
	supportedSignals: [
		TelemetrytypesSignalDTO.metrics,
		TelemetrytypesSignalDTO.logs,
		TelemetrytypesSignalDTO.traces,
	],
<<<<<<< HEAD
=======
	supportedQueryTypes: [
		EQueryType.QUERY_BUILDER,
		EQueryType.CLICKHOUSE,
		EQueryType.PROM,
	],
	queryBuilderFields: {},
>>>>>>> upstream/main
	actions: {
		view: true,
		edit: true,
		clone: true,
<<<<<<< HEAD
		download: false,
		createAlert: true,
		search: false,
=======
		download: { csv: false, png: true, svg: true },
		createAlert: true,
		search: false,
		drilldown: false,
>>>>>>> upstream/main
	},
};
