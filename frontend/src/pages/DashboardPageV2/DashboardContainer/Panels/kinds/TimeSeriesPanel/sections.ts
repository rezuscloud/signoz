<<<<<<< HEAD
import type { SectionConfig } from '../../types/sections';

export const sections: SectionConfig[] = [
	{ kind: 'visualization', controls: { timePreference: true, fillSpans: true } },
	{ kind: 'formatting', controls: { unit: true, decimals: true } },
	{ kind: 'axes', controls: { minMax: true, logScale: true } },
	{ kind: 'legend', controls: { position: true, colors: true } },
	{
		kind: 'chartAppearance',
=======
import {
	SectionKind,
	ThresholdVariant,
	type SectionConfig,
} from '../../types/sections';

export const sections: SectionConfig[] = [
	{
		kind: SectionKind.Visualization,
		controls: { switchPanelKind: true, timePreference: true, fillSpans: true },
	},
	{ kind: SectionKind.Formatting, controls: { unit: true, decimals: true } },
	{ kind: SectionKind.Axes, controls: { minMax: true, logScale: true } },
	{ kind: SectionKind.Legend, controls: { position: true, colors: true } },
	{
		kind: SectionKind.ChartAppearance,
>>>>>>> upstream/main
		controls: {
			lineStyle: true,
			lineInterpolation: true,
			fillMode: true,
			showPoints: true,
			spanGaps: true,
		},
	},
<<<<<<< HEAD
	{ kind: 'thresholds', controls: { variant: 'label' } },
	{ kind: 'contextLinks' },
=======
	{
		kind: SectionKind.Thresholds,
		controls: { variant: ThresholdVariant.LABEL },
	},
	{ kind: SectionKind.ContextLinks },
>>>>>>> upstream/main
];
