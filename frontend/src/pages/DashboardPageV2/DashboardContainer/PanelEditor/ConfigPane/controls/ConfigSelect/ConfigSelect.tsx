<<<<<<< HEAD
import { Select } from 'antd';

import { SegmentIcon, type SegmentIconName } from '../segmentIcons';

import styles from './ConfigSelect.module.scss';

export interface ConfigSelectItem {
	value: string;
	label: string;
	icon?: SegmentIconName;
}

interface ConfigSelectProps {
	testId: string;
	value: string | undefined;
	placeholder?: string;
	items: ConfigSelectItem[];
	onChange: (value: string) => void;
=======
import type { ReactNode } from 'react';
import { Select, Tooltip } from 'antd';

import styles from './ConfigSelect.module.scss';

export interface ConfigSelectItem<T extends string = string> {
	value: T;
	label: string;
	/** Optional leading icon node rendered before the label. */
	icon?: ReactNode;
	disabled?: boolean;
	/** Hover hint shown on the option — typically the reason a disabled item is disabled. */
	tooltip?: string;
}

interface ConfigSelectProps<T extends string = string> {
	testId: string;
	value: T | undefined;
	placeholder?: string;
	items: ConfigSelectItem<T>[];
	onChange: (value: T) => void;
>>>>>>> upstream/main
}

/**
 * Single-select dropdown for the panel editor's config sections. Built on antd's
 * `Select` so it matches the rest of the editor's antd controls; the menu portals to
 * `document.body` (antd default) so the surrounding `overflow:auto` pane can't clip it.
 */
<<<<<<< HEAD
function ConfigSelect({
=======
function ConfigSelect<T extends string = string>({
>>>>>>> upstream/main
	testId,
	value,
	placeholder,
	items,
	onChange,
<<<<<<< HEAD
}: ConfigSelectProps): JSX.Element {
	return (
		<Select<string>
=======
}: ConfigSelectProps<T>): JSX.Element {
	return (
		<Select<T>
>>>>>>> upstream/main
			className={styles.select}
			data-testid={testId}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			virtual={false}
<<<<<<< HEAD
			options={items.map((item) => ({
				value: item.value,
				label: item.icon ? (
					<span className={styles.item}>
						<SegmentIcon name={item.icon} />
=======
			options={items.map((item) => {
				const content = item.icon ? (
					<span className={styles.item}>
						{item.icon}
>>>>>>> upstream/main
						{item.label}
					</span>
				) : (
					item.label
<<<<<<< HEAD
				),
			}))}
=======
				);
				return {
					value: item.value,
					disabled: item.disabled,
					label: item.tooltip ? (
						<Tooltip title={item.tooltip} placement="top">
							<span className={styles.tooltipTrigger}>{content}</span>
						</Tooltip>
					) : (
						content
					),
				};
			})}
>>>>>>> upstream/main
		/>
	);
}

export default ConfigSelect;
