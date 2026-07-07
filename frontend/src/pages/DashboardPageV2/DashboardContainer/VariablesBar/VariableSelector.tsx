import { useMemo } from 'react';
import { SolidInfoCircle } from '@signozhq/icons';
import { Typography } from '@signozhq/ui/typography';
// eslint-disable-next-line signoz/no-antd-components -- lightweight description tooltip, matches V1
import { Tooltip } from 'antd';
import { commaValuesParser } from 'lib/dashboardVariables/customCommaValuesParser';

import { sortValuesByOrder } from '../DashboardSettings/Variables/variableFormModel';
import type { VariableFormModel } from '../DashboardSettings/Variables/variableFormModel';
import type { VariableSelection, VariableSelectionMap } from './selectionTypes';
import DynamicSelector from './selectors/DynamicSelector';
import QuerySelector from './selectors/QuerySelector';
import TextSelector from './selectors/TextSelector';
import ValueSelector from './selectors/ValueSelector';
import styles from './VariablesBar.module.scss';

interface VariableSelectorProps {
	variable: VariableFormModel;
	/** All variables (Dynamic uses them to scope options by sibling selections). */
	variables: VariableFormModel[];
<<<<<<< HEAD
	/** Names this variable depends on (for Query gating). */
	parents: string[];
=======
>>>>>>> upstream/main
	/** All current selections (Query passes them as the request payload). */
	selections: VariableSelectionMap;
	selection: VariableSelection;
	onChange: (selection: VariableSelection) => void;
<<<<<<< HEAD
=======
	/** Batched fill applied when options resolve (Query/Dynamic auto-selection). */
	onAutoSelect: (selection: VariableSelection) => void;
>>>>>>> upstream/main
}

/** One labelled variable control; dispatches on the variable type. */
function VariableSelector({
	variable,
	variables,
<<<<<<< HEAD
	parents,
	selections,
	selection,
	onChange,
=======
	selections,
	selection,
	onChange,
	onAutoSelect,
>>>>>>> upstream/main
}: VariableSelectorProps): JSX.Element {
	const customOptions = useMemo(
		() =>
			variable.type === 'CUSTOM'
				? sortValuesByOrder(
						commaValuesParser(variable.customValue),
						variable.sort,
					).map(String)
				: [],
		[variable],
	);

	const renderControl = (): JSX.Element => {
		switch (variable.type) {
			case 'TEXT':
				return (
					<TextSelector
						selection={selection}
						defaultValue={variable.textValue}
						onChange={onChange}
						testId={`variable-input-${variable.name}`}
					/>
				);
			case 'QUERY':
				return (
					<QuerySelector
						variable={variable}
<<<<<<< HEAD
						parents={parents}
						selections={selections}
						selection={selection}
						onChange={onChange}
=======
						selections={selections}
						selection={selection}
						onChange={onChange}
						onAutoSelect={onAutoSelect}
>>>>>>> upstream/main
					/>
				);
			case 'DYNAMIC':
				return (
					<DynamicSelector
						variable={variable}
						variables={variables}
						selections={selections}
						selection={selection}
						onChange={onChange}
<<<<<<< HEAD
=======
						onAutoSelect={onAutoSelect}
>>>>>>> upstream/main
					/>
				);
			case 'CUSTOM':
			default:
				return (
					<ValueSelector
						options={customOptions}
						multiSelect={variable.multiSelect}
						showAllOption={variable.showAllOption}
						selection={selection}
						onChange={onChange}
						testId={`variable-select-${variable.name}`}
					/>
				);
		}
	};

	return (
		<div
			className={styles.variableItem}
			data-testid={`variable-${variable.name}`}
		>
			<Typography.Text className={styles.variableName}>
				${variable.name}
				{variable.description ? (
					<Tooltip title={variable.description}>
						<SolidInfoCircle className={styles.infoIcon} size={14} />
					</Tooltip>
				) : null}
			</Typography.Text>

			<div className={styles.variableValue}>{renderControl()}</div>
		</div>
	);
}

export default VariableSelector;
