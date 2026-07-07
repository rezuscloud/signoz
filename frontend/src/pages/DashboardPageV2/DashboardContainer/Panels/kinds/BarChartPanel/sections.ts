<<<<<<< HEAD
import type { SectionConfig } from '../../types/sections';
=======
import {
	SectionKind,
	ThresholdVariant,
	type SectionConfig,
} from '../../types/sections';
>>>>>>> upstream/main

// Bar stacking lives in `visualization.stackedBarChart`, so it's a `visualization`
// control, not `chartAppearance`. fillSpans is TimeSeries-only, so Bar omits it (V1 parity).
export const sections: SectionConfig[] = [
<<<<<<< HEAD
	{ kind: 'visualization', controls: { timePreference: true, stacking: true } },
	{ kind: 'formatting', controls: { unit: true, decimals: true } },
	{ kind: 'axes', controls: { minMax: true, logScale: true } },
	{ kind: 'legend', controls: { position: true } },
	{ kind: 'thresholds', controls: { variant: 'label' } },
	{ kind: 'contextLinks' },
=======
	{
		kind: SectionKind.Visualization,
		controls: { switchPanelKind: true, timePreference: true, stacking: true },
	},
	{ kind: SectionKind.Formatting, controls: { unit: true, decimals: true } },
	{ kind: SectionKind.Axes, controls: { minMax: true, logScale: true } },
	{ kind: SectionKind.Legend, controls: { position: true } },
	{
		kind: SectionKind.Thresholds,
		controls: { variant: ThresholdVariant.LABEL },
	},
	{ kind: SectionKind.ContextLinks },
>>>>>>> upstream/main
];
