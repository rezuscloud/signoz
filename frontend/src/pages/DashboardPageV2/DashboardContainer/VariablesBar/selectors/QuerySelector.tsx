import { useMemo } from 'react';
import { useQuery } from 'react-query';
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';
import dashboardVariablesQuery from 'api/dashboard/variables/dashboardVariablesQuery';
import type { AppState } from 'store/reducers';
import type { GlobalReducer } from 'types/reducer/globalTime';

import { sortValuesByOrder } from '../../DashboardSettings/Variables/variableFormModel';
import type { VariableFormModel } from '../../DashboardSettings/Variables/variableFormModel';
<<<<<<< HEAD
=======
import { useDashboardStore } from '../../store/useDashboardStore';
>>>>>>> upstream/main
import type {
	VariableSelection,
	VariableSelectionMap,
} from '../selectionTypes';
<<<<<<< HEAD
import { isResolved, selectionToPayload } from '../selectionUtils';
import { useAutoSelect } from '../useAutoSelect';
=======
import { selectionToPayload } from '../selectionUtils';
import { useAutoSelect } from '../useAutoSelect';
import { useVariableFetchState } from '../useVariableFetchState';
>>>>>>> upstream/main
import ValueSelector from './ValueSelector';

interface QuerySelectorProps {
	variable: VariableFormModel;
<<<<<<< HEAD
	/** Names this variable's query references; it waits until they're resolved. */
	parents: string[];
=======
>>>>>>> upstream/main
	/** All current selections, fed to the query as `{ name: value }`. */
	selections: VariableSelectionMap;
	selection: VariableSelection;
	onChange: (selection: VariableSelection) => void;
<<<<<<< HEAD
}

/**
 * Query-driven options. Dependency orchestration is declarative: the query is
 * `enabled` only once every parent is resolved, and the parent values are in the
 * query key — so it refetches automatically when a parent changes (and a cyclic
 * dependency is simply never enabled).
 */
function QuerySelector({
	variable,
	parents,
	selections,
	selection,
	onChange,
=======
	/** Batched auto-selection fill applied when options resolve. */
	onAutoSelect: (selection: VariableSelection) => void;
}

/**
 * Query-driven options. WHEN to fetch is owned by the runtime fetch engine
 * (`variableFetchSlice`): the query is `enabled` while this variable is fetching
 * (or settled-after-a-first-fetch, so a cycle bump re-runs it), and the engine's
 * per-variable `cycleId` keys the request — so a parent's value change refetches
 * only the dependent variables, in dependency order. The current selections feed
 * the request payload but are deliberately NOT in the key (V1 parity).
 */
function QuerySelector({
	variable,
	selections,
	selection,
	onChange,
	onAutoSelect,
>>>>>>> upstream/main
}: QuerySelectorProps): JSX.Element {
	const { minTime, maxTime } = useSelector<AppState, GlobalReducer>(
		(state) => state.globalTime,
	);
	const payload = useMemo(() => selectionToPayload(selections), [selections]);
<<<<<<< HEAD
	const enabled = parents.every((parent) => isResolved(selections[parent]));
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
>>>>>>> upstream/main

	const { data, isFetching } = useQuery(
		[
			'dashboard-variable',
			variable.name,
			variable.queryValue,
<<<<<<< HEAD
			payload,
			minTime,
			maxTime,
=======
			minTime,
			maxTime,
			variableFetchCycleId,
>>>>>>> upstream/main
		],
		() =>
			dashboardVariablesQuery({
				query: variable.queryValue,
				variables: payload,
			}),
<<<<<<< HEAD
		{ enabled, refetchOnWindowFocus: false },
=======
		{
			enabled: isVariableFetching || (isVariableSettled && hasVariableFetchedOnce),
			refetchOnWindowFocus: false,
			onSettled: (_, error) =>
				error
					? onVariableFetchFailure(variable.name)
					: onVariableFetchComplete(variable.name),
		},
>>>>>>> upstream/main
	);

	const options = useMemo(() => {
		if (!data || data.statusCode !== 200 || !data.payload) {
			return [] as string[];
		}
		return sortValuesByOrder(
			data.payload.variableValues ?? [],
			variable.sort,
		).map(String);
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

export default QuerySelector;
