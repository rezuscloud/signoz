<<<<<<< HEAD
import { Clock, RotateCw } from '@signozhq/icons';

import PanelMessage from '../PanelMessage/PanelMessage';

interface NoDataProps {
	/** Title override. Defaults to the time-range empty-state copy. */
	title?: string;
	/** Description override. Defaults to the "widen the range" hint. */
	description?: string;
=======
import { CalendarRange, Clock, RotateCw } from '@signozhq/icons';

import {
	selectViewPanelExtendWindow,
	useViewPanelStore,
} from '../../../store/useViewPanelStore';
import PanelLoader from '../PanelLoader/PanelLoader';
import PanelMessage, { PanelMessageAction } from '../PanelMessage/PanelMessage';
import { useExtendTimeWindow } from './useExtendTimeWindow';

interface NoDataProps {
	title?: string;
	description?: string;
	/** In flight over empty data → show the loader, not the empty state. */
	isFetching?: boolean;
>>>>>>> upstream/main
	/** When provided, renders a Retry button that re-runs the query. */
	onRetry?: () => void;
	'data-testid'?: string;
}

/**
<<<<<<< HEAD
 * Shared empty-state for panel renderers: wraps `PanelMessage` so every panel
 * kind surfaces the same "no data" affordance when a query returns nothing.
=======
 * Shared empty-state for panel renderers. The query succeeded but returned nothing,
 * so we offer to widen the time window — global by default, or the View modal's
 * local window when it publishes one to the store — alongside a Retry that re-runs
 * the query.
>>>>>>> upstream/main
 */
function NoData({
	title = 'No data in this time range',
	description = 'Nothing in the selected window. Try widening the range.',
<<<<<<< HEAD
	onRetry,
	'data-testid': testId = 'panel-no-data',
}: NoDataProps): JSX.Element {
=======
	isFetching = false,
	onRetry,
	'data-testid': testId = 'panel-no-data',
}: NoDataProps): JSX.Element {
	const viewExtend = useViewPanelStore(selectViewPanelExtendWindow);
	const globalExtend = useExtendTimeWindow();
	const { canExtend, actionLabel, extend } = viewExtend ?? globalExtend;

	if (isFetching) {
		return <PanelLoader />;
	}

	const extendAction: PanelMessageAction | undefined =
		canExtend && actionLabel
			? { label: actionLabel, onClick: extend, icon: <CalendarRange size={14} /> }
			: undefined;

	const retryAction: PanelMessageAction | undefined = onRetry
		? { label: 'Retry', onClick: onRetry, icon: <RotateCw size={14} /> }
		: undefined;

>>>>>>> upstream/main
	return (
		<PanelMessage
			icon={<Clock size={18} />}
			title={title}
			description={description}
<<<<<<< HEAD
			action={
				onRetry
					? { label: 'Retry', onClick: onRetry, icon: <RotateCw size={14} /> }
					: undefined
			}
=======
			action={extendAction ?? retryAction}
			secondaryAction={extendAction ? retryAction : undefined}
>>>>>>> upstream/main
			data-testid={testId}
		/>
	);
}

export default NoData;
