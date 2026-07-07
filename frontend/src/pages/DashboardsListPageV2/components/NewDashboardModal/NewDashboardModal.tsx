import { useEffect, useState } from 'react';
import { DialogWrapper } from '@signozhq/ui/dialog';
import { Tabs } from '@signozhq/ui/tabs';

import BlankDashboardPanel from './BlankDashboardPanel';
import ImportJsonPanel from './ImportJsonPanel';
import TemplatesPanel from './TemplatesPanel';

interface Props {
	open: boolean;
	onClose: () => void;
}

function NewDashboardModal({ open, onClose }: Props): JSX.Element {
	const [tab, setTab] = useState('blank');

	useEffect(() => {
		if (open) {
			setTab('blank');
		}
	}, [open]);

	return (
		<DialogWrapper
			title="New dashboard"
			open={open}
			width="wide"
			onOpenChange={(next): void => {
				if (!next) {
					onClose();
				}
			}}
		>
			<Tabs
				value={tab}
				onChange={(key): void => setTab(key)}
				items={[
					{
						key: 'blank',
						label: 'Blank',
						children: <BlankDashboardPanel onClose={onClose} />,
					},
					{
						key: 'template',
						label: 'From a template',
<<<<<<< HEAD
						children: <TemplatesPanel />,
=======
						children: <TemplatesPanel onClose={onClose} />,
>>>>>>> upstream/main
					},
					{
						key: 'import',
						label: 'Import JSON',
<<<<<<< HEAD
						children: <ImportJsonPanel />,
=======
						children: <ImportJsonPanel onClose={onClose} />,
>>>>>>> upstream/main
					},
				]}
			/>
		</DialogWrapper>
	);
}

export default NewDashboardModal;
