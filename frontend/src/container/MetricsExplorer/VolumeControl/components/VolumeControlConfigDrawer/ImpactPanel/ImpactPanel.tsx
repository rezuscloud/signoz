<<<<<<< HEAD
import { Typography } from '@signozhq/ui/typography';
import { Spin } from 'antd';
import { MetricreductionruletypesGettableReductionRulePreviewDTO } from 'api/generated/services/sigNoz.schemas';
=======
import { Info } from '@signozhq/icons';
import { Typography } from '@signozhq/ui/typography';
import { Spin, Tooltip } from 'antd';
import { MetricreductionruletypesGettableReductionRulePreviewDTO } from 'api/generated/services/sigNoz.schemas';
import { popupContainer } from 'utils/selectPopupContainer';
>>>>>>> upstream/main

import { formatCompact } from '../../../configUtils';
import { RuleMode } from '../../../types';
import styles from './ImpactPanel.module.scss';

interface ImpactPanelProps {
	mode: RuleMode;
	preview?: MetricreductionruletypesGettableReductionRulePreviewDTO;
	isLoading: boolean;
}

function ImpactPanel({
	mode,
	preview,
	isLoading,
}: ImpactPanelProps): JSX.Element {
	if (mode === 'all') {
		return (
			<div className={styles.impactPanel} data-testid="volume-control-impact">
				<Typography.Text size="small" color="muted">
					All attributes remain queryable, no reduction.
				</Typography.Text>
			</div>
		);
	}

<<<<<<< HEAD
=======
	const full = preview?.ingestedSeries ?? 0;
>>>>>>> upstream/main
	const current = preview?.currentRetainedSeries ?? 0;
	const proposed = preview?.retainedSeries ?? 0;
	const deltaPct = current > 0 ? (1 - proposed / current) * 100 : 0;
	const reductionLabel = `${deltaPct >= 0 ? '−' : '+'}${Math.round(
		Math.abs(deltaPct),
	)}%`;

	return (
		<div className={styles.impactPanel} data-testid="volume-control-impact">
			{isLoading && <Spin size="small" />}
			{!isLoading && preview && (
				<div className={styles.meterGrid}>
					<div className={styles.meter}>
<<<<<<< HEAD
						<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
							Current series
						</Typography.Text>
=======
						<div className={styles.meterLabelRow}>
							<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
								Full series
							</Typography.Text>
							<Tooltip
								title="Total number of series for this metric before any reduction."
								getPopupContainer={popupContainer}
							>
								<Info size={12} className={styles.meterInfo} />
							</Tooltip>
						</div>
						<Typography.Text size="2xl" className={styles.meterValue}>
							{formatCompact(full)}
						</Typography.Text>
					</div>
					<div className={styles.meter}>
						<div className={styles.meterLabelRow}>
							<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
								Current retained
							</Typography.Text>
							<Tooltip
								title="Series kept today under the metric's existing rule, or all of them if it has no rule yet."
								getPopupContainer={popupContainer}
							>
								<Info size={12} className={styles.meterInfo} />
							</Tooltip>
						</div>
>>>>>>> upstream/main
						<Typography.Text size="2xl" className={styles.meterValue}>
							{formatCompact(current)}
						</Typography.Text>
					</div>
					<div className={styles.meter}>
<<<<<<< HEAD
						<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
							Proposed series
						</Typography.Text>
						<Typography.Text size="2xl" className={styles.meterValue}>
							{formatCompact(proposed)}
						</Typography.Text>
					</div>
					<div className={styles.meter}>
						<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
							Reduction
						</Typography.Text>
						<Typography.Text
							size="2xl"
							color={deltaPct >= 0 ? 'success' : undefined}
							className={styles.meterValue}
						>
							{reductionLabel}
=======
						<div className={styles.meterLabelRow}>
							<Typography.Text size="xs" color="muted" className={styles.meterLabel}>
								Potential retained
							</Typography.Text>
							<Tooltip
								title="Series that would be kept if you save this rule, with the reduction vs what's retained today."
								getPopupContainer={popupContainer}
							>
								<Info size={12} className={styles.meterInfo} />
							</Tooltip>
						</div>
						<Typography.Text size="2xl" className={styles.meterValue}>
							{formatCompact(proposed)}
							{deltaPct !== 0 && (
								<Typography.Text
									size="small"
									color={deltaPct >= 0 ? 'success' : undefined}
								>
									{reductionLabel}
								</Typography.Text>
							)}
>>>>>>> upstream/main
						</Typography.Text>
					</div>
				</div>
			)}
			{!isLoading && !preview && (
				<Typography.Text size="small" color="muted">
					Select attributes to preview the impact.
				</Typography.Text>
			)}
		</div>
	);
}

export default ImpactPanel;
