import { Gauge } from '@signozhq/icons';
<<<<<<< HEAD
=======
import { Tooltip } from 'antd';
>>>>>>> upstream/main
import { MetricreductionruletypesGettableReductionRuleDTO } from 'api/generated/services/sigNoz.schemas';

import { Badge } from '@signozhq/ui/badge';

interface VolumeControlBadgeProps {
	rule: MetricreductionruletypesGettableReductionRuleDTO;
}

function VolumeControlBadge({ rule }: VolumeControlBadgeProps): JSX.Element {
<<<<<<< HEAD
	return (
		<Badge
			data-testid="vc-badge-active"
			variant="outline"
			color={!rule.active ? 'success' : 'warning'}
		>
			<Gauge size={12} />
			{!rule.active ? 'Active' : 'Pending'}
		</Badge>
	);
=======
	const badge = (
		<Badge
			data-testid="vc-badge-active"
			variant="outline"
			color={rule.active ? 'success' : 'warning'}
		>
			<Gauge size={12} />
			{rule.active ? 'Active' : 'Pending'}
		</Badge>
	);

	if (rule.active) {
		return badge;
	}

	return (
		<Tooltip title="Takes about 5 minutes to take effect">
			<span>{badge}</span>
		</Tooltip>
	);
>>>>>>> upstream/main
}

export default VolumeControlBadge;
