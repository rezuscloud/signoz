<<<<<<< HEAD
import type { SectionConfig } from '../../types/sections';
=======
import { SectionKind, type SectionConfig } from '../../types/sections';
>>>>>>> upstream/main

// Pie has no axes, thresholds, or stacking — just value formatting and a legend.
// Legend `colors` is omitted: the pie legend is always interactive swatches.
export const sections: SectionConfig[] = [
<<<<<<< HEAD
	{ kind: 'visualization', controls: { timePreference: true } },
	{ kind: 'formatting', controls: { unit: true, decimals: true } },
	{ kind: 'legend', controls: { position: true } },
	{ kind: 'contextLinks' },
=======
	{
		kind: SectionKind.Visualization,
		controls: { switchPanelKind: true, timePreference: true },
	},
	{ kind: SectionKind.Formatting, controls: { unit: true, decimals: true } },
	{ kind: SectionKind.Legend, controls: { position: true } },
	{ kind: SectionKind.ContextLinks },
>>>>>>> upstream/main
];
