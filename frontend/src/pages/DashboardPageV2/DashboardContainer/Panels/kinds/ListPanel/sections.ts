<<<<<<< HEAD
import type { SectionConfig } from '../../types/sections';

export const sections: SectionConfig[] = [];
=======
import { SectionKind, type SectionConfig } from '../../types/sections';

export const sections: SectionConfig[] = [
	{
		kind: SectionKind.Visualization,
		controls: { switchPanelKind: true },
	},
];
>>>>>>> upstream/main
