<<<<<<< HEAD
import type { ChangeEvent } from 'react';
import { Typography } from '@signozhq/ui/typography';
import { Input } from 'antd';
=======
import { Typography } from '@signozhq/ui/typography';
>>>>>>> upstream/main
import {
	DashboardtypesFillModeDTO,
	DashboardtypesLineInterpolationDTO,
	DashboardtypesLineStyleDTO,
} from 'api/generated/services/sigNoz.schemas';
<<<<<<< HEAD
import type { SectionEditorProps } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/sections';
=======
import type {
	SectionEditorProps,
	SectionKind,
} from 'pages/DashboardPageV2/DashboardContainer/Panels/types/sections';
>>>>>>> upstream/main

import ConfigSegmented from '../../controls/ConfigSegmented/ConfigSegmented';
import ConfigSelect from '../../controls/ConfigSelect/ConfigSelect';
import ConfigSwitch from '../../controls/ConfigSwitch/ConfigSwitch';
<<<<<<< HEAD
=======
import { SegmentIcon } from '../../controls/segmentIcons';
import type { SectionEditorContext } from '../../sectionContext';
import DisconnectValuesField from './DisconnectValuesField';
>>>>>>> upstream/main

import styles from './ChartAppearanceSection.module.scss';

const LINE_STYLE_OPTIONS = [
	{
		value: DashboardtypesLineStyleDTO.solid,
		label: 'Solid',
		icon: 'solid-line' as const,
	},
	{
		value: DashboardtypesLineStyleDTO.dashed,
		label: 'Dashed',
		icon: 'dashed-line' as const,
	},
];

const LINE_INTERPOLATION_OPTIONS = [
	{
		value: DashboardtypesLineInterpolationDTO.linear,
		label: 'Linear',
<<<<<<< HEAD
		icon: 'interp-linear' as const,
=======
		icon: <SegmentIcon name="interp-linear" />,
>>>>>>> upstream/main
	},
	{
		value: DashboardtypesLineInterpolationDTO.spline,
		label: 'Spline',
<<<<<<< HEAD
		icon: 'interp-spline' as const,
=======
		icon: <SegmentIcon name="interp-spline" />,
>>>>>>> upstream/main
	},
	{
		value: DashboardtypesLineInterpolationDTO.step_before,
		label: 'Step before',
<<<<<<< HEAD
		icon: 'interp-step-before' as const,
=======
		icon: <SegmentIcon name="interp-step-before" />,
>>>>>>> upstream/main
	},
	{
		value: DashboardtypesLineInterpolationDTO.step_after,
		label: 'Step after',
<<<<<<< HEAD
		icon: 'interp-step-after' as const,
=======
		icon: <SegmentIcon name="interp-step-after" />,
>>>>>>> upstream/main
	},
];

const FILL_MODE_OPTIONS = [
	{
		value: DashboardtypesFillModeDTO.none,
		label: 'None',
		icon: 'fill-none' as const,
	},
	{
		value: DashboardtypesFillModeDTO.solid,
		label: 'Solid',
		icon: 'fill-solid' as const,
	},
	{
		value: DashboardtypesFillModeDTO.gradient,
		label: 'Gradient',
		icon: 'fill-gradient' as const,
	},
];

/**
 * Edits the `chartAppearance` slice of a TimeSeries panel spec: line style /
 * interpolation, fill mode, point markers, and the connect-null-gaps threshold. Each
 * control is gated by its `controls` flag.
 */
function ChartAppearanceSection({
	value,
	controls,
	onChange,
<<<<<<< HEAD
}: SectionEditorProps<'chartAppearance'>): JSX.Element {
	// `spanGaps.fillLessThan` is a stringified seconds threshold: empty means "connect
	// every gap" (the chart default), a number means "only bridge gaps shorter than this".
	const handleSpanGaps = (e: ChangeEvent<HTMLInputElement>): void => {
		const raw = e.target.value;
		onChange({
			...value,
			spanGaps: raw === '' ? undefined : { ...value?.spanGaps, fillLessThan: raw },
		});
	};
=======
	stepInterval,
}: SectionEditorProps<SectionKind.ChartAppearance> &
	Pick<SectionEditorContext, 'stepInterval'>): JSX.Element {
>>>>>>> upstream/main
	return (
		<>
			{controls.lineStyle && (
				<div className={styles.field}>
					<Typography.Text>Line style</Typography.Text>
					<ConfigSegmented
						testId="panel-editor-v2-line-style"
						value={value?.lineStyle}
						items={LINE_STYLE_OPTIONS}
						onChange={(next): void =>
							onChange({ ...value, lineStyle: next as DashboardtypesLineStyleDTO })
						}
					/>
				</div>
			)}

			{controls.lineInterpolation && (
				<div className={styles.field}>
					<Typography.Text>Line interpolation</Typography.Text>
					<ConfigSelect
						testId="panel-editor-v2-line-interpolation"
						placeholder="Select interpolation…"
						value={value?.lineInterpolation}
						items={LINE_INTERPOLATION_OPTIONS}
						onChange={(next): void =>
							onChange({
								...value,
<<<<<<< HEAD
								lineInterpolation: next as DashboardtypesLineInterpolationDTO,
=======
								lineInterpolation: next,
>>>>>>> upstream/main
							})
						}
					/>
				</div>
			)}

			{controls.fillMode && (
				<div className={styles.field}>
					<Typography.Text>Fill mode</Typography.Text>
					<ConfigSegmented
						testId="panel-editor-v2-fill-mode"
						value={value?.fillMode}
						items={FILL_MODE_OPTIONS}
						onChange={(next): void =>
							onChange({ ...value, fillMode: next as DashboardtypesFillModeDTO })
						}
					/>
				</div>
			)}

			{controls.showPoints && (
				<ConfigSwitch
					testId="panel-editor-v2-show-points"
					title="Show points"
					description="Display individual data points on the chart"
					value={value?.showPoints ?? false}
					onChange={(checked): void => onChange({ ...value, showPoints: checked })}
				/>
			)}

			{controls.spanGaps && (
<<<<<<< HEAD
				<div className={styles.field}>
					<Typography.Text>Connect gaps shorter than (s)</Typography.Text>
					<Input
						data-testid="panel-editor-v2-span-gaps"
						type="number"
						placeholder="All gaps"
						value={value?.spanGaps?.fillLessThan ?? ''}
						onChange={handleSpanGaps}
					/>
				</div>
=======
				<DisconnectValuesField
					testId="panel-editor-v2-span-gaps"
					value={value?.spanGaps}
					stepInterval={stepInterval}
					onChange={(spanGaps): void => onChange({ ...value, spanGaps })}
				/>
>>>>>>> upstream/main
			)}
		</>
	);
}

export default ChartAppearanceSection;
