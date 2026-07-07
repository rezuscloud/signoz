import type { DashboardtypesHistogramPanelSpecDTO } from 'api/generated/services/sigNoz.schemas';

<<<<<<< HEAD
import type { SectionConfig } from '../../types/sections';

export const sections: SectionConfig[] = [
	{
		kind: 'legend',
=======
import { SectionKind, type SectionConfig } from '../../types/sections';

export const sections: SectionConfig[] = [
	{
		kind: SectionKind.Visualization,
		controls: { switchPanelKind: true },
	},
	{
		kind: SectionKind.Legend,
>>>>>>> upstream/main
		controls: { position: true },
		// Merging all queries collapses to one distribution with no legend.
		isHidden: (spec): boolean =>
			Boolean(
				(spec.plugin.spec as DashboardtypesHistogramPanelSpecDTO).histogramBuckets
					?.mergeAllActiveQueries,
			),
	},
	{
<<<<<<< HEAD
		kind: 'buckets',
		controls: { count: true, width: true, mergeQueries: true },
	},
	{ kind: 'contextLinks' },
=======
		kind: SectionKind.Buckets,
		controls: { count: true, width: true, mergeQueries: true },
	},
	{ kind: SectionKind.ContextLinks },
>>>>>>> upstream/main
];
