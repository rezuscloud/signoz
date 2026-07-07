import { useMemo } from 'react';
<<<<<<< HEAD
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';
import { useGetFieldValues } from 'hooks/dynamicVariables/useGetFieldValues';
=======
import { useQuery } from 'react-query';
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';
import { getFieldValues } from 'api/dynamicVariables/getFieldValues';
>>>>>>> upstream/main
import type { AppState } from 'store/reducers';
import type { GlobalReducer } from 'types/reducer/globalTime';

import {
	signalForApi,
	sortValuesByOrder,
} from '../../DashboardSettings/Variables/variableFormModel';
import type { VariableFormModel } from '../../DashboardSettings/Variables/variableFormModel';
<<<<<<< HEAD
=======
import { useDashboardStore } from '../../store/useDashboardStore';
>>>>>>> upstream/main
import { buildExistingDynamicVariableQuery } from '../dynamicFilter';
import type {
	VariableSelection,
	VariableSelectionMap,
} from '../selectionTypes';
import { useAutoSelect } from '../useAutoSelect';
<<<<<<< HEAD
=======
import { useVariableFetchState } from '../useVariableFetchState';
>>>>>>> upstream/main
import ValueSelector from './ValueSelector';

interface DynamicSelectorProps {
	variable: VariableFormModel;
	/** All variables + current selections, to scope options by sibling dynamics. */
	variables: VariableFormModel[];
	selections: VariableSelectionMap;
	selection: VariableSelection;
	onChange: (selection: VariableSelection) => void;
<<<<<<< HEAD
=======
	/** Batched auto-selection fill applied when options resolve. */
	onAutoSelect: (selection: VariableSelection) => void;
>>>>>>> upstream/main
}

/**
 * Dynamic-variable options sourced from live telemetry field values for the
 * chosen signal + attribute, scoped by the other dynamic variables' selections
<<<<<<< HEAD
 * (so e.g. `pod` narrows to the chosen `namespace`).
=======
 * (so e.g. `pod` narrows to the chosen `namespace`). WHEN to fetch is owned by
 * the runtime fetch engine: dynamics fetch together once the query variables have
 * values, and refetch (via a `cycleId` bump) whenever any variable value changes.
>>>>>>> upstream/main
 */
function DynamicSelector({
	variable,
	variables,
	selections,
	selection,
	onChange,
<<<<<<< HEAD
=======
	onAutoSelect,
>>>>>>> upstream/main
}: DynamicSelectorProps): JSX.Element {
	const { minTime, maxTime } = useSelector<AppState, GlobalReducer>(
		(state) => state.globalTime,
	);

	const existingQuery = useMemo(
		() => buildExistingDynamicVariableQuery(variables, selections, variable.name),
		[variables, selections, variable.name],
	);

<<<<<<< HEAD
	const { data, isFetching } = useGetFieldValues({
		signal: signalForApi(variable.dynamicSignal),
		name: variable.dynamicAttribute,
		startUnixMilli: minTime,
		endUnixMilli: maxTime,
		existingQuery: existingQuery || undefined,
		enabled: !!variable.dynamicAttribute,
	});
=======
	const {
		variableFetchCycleId,
		isVariableFetching,
		isVariableSettled,
		isVariableWaiting,
		hasVariableFetchedOnce,
	} = useVariableFetchState(variable.name);
	const onVariableFetchComplete = useDashboardStore(
		(s) => s.onVariableFetchComplete,
	);
	const onVariableFetchFailure = useDashboardStore(
		(s) => s.onVariableFetchFailure,
	);

	const { data, isFetching } = useQuery(
		[
			'dashboard-variable-dynamic',
			variable.name,
			variable.dynamicSignal,
			variable.dynamicAttribute,
			existingQuery,
			minTime,
			maxTime,
			variableFetchCycleId,
		],
		() =>
			getFieldValues(
				signalForApi(variable.dynamicSignal),
				variable.dynamicAttribute,
				undefined,
				minTime,
				maxTime,
				existingQuery || undefined,
			),
		{
			enabled:
				!!variable.dynamicAttribute &&
				(isVariableFetching || (isVariableSettled && hasVariableFetchedOnce)),
			refetchOnWindowFocus: false,
			onSettled: (_, error) =>
				error
					? onVariableFetchFailure(variable.name)
					: onVariableFetchComplete(variable.name),
		},
	);
>>>>>>> upstream/main

	const options = useMemo(() => {
		const payload = data?.data;
		const values =
			payload?.normalizedValues ?? payload?.values?.StringValues ?? [];
		return sortValuesByOrder(values, variable.sort).map(String);
	}, [data, variable.sort]);

<<<<<<< HEAD
	useAutoSelect(variable, options, selection, onChange);
=======
	useAutoSelect(variable, options, selection, onAutoSelect);
>>>>>>> upstream/main

	return (
		<ValueSelector
			options={options}
			multiSelect={variable.multiSelect}
			showAllOption={variable.showAllOption}
<<<<<<< HEAD
			loading={isFetching}
=======
			loading={isFetching || isVariableWaiting}
>>>>>>> upstream/main
			selection={selection}
			onChange={onChange}
			testId={`variable-select-${variable.name}`}
		/>
	);
}

export default DynamicSelector;
