import { useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import type { DashboardtypesGettableDashboardV2DTO } from 'api/generated/services/sigNoz.schemas';
import useComponentPermission from 'hooks/useComponentPermission';
import { useAppContext } from 'providers/App/App';

import DashboardPageToolbar from './DashboardPageToolbar';
import PanelsAndSectionsLayout from './PanelsAndSectionsLayout';
<<<<<<< HEAD
=======
import { useResolvedVariables } from './hooks/useResolvedVariables';
import { useSyncVariablesForSuggestions } from './hooks/useSyncVariablesForSuggestions';
>>>>>>> upstream/main
import { useDashboardStore } from './store/useDashboardStore';
import styles from './DashboardContainer.module.scss';
import DashboardPageHeader from './components/DashboardPageHeader/DashboardPageHeader';
import { Base64Icons } from './DashboardSettings/Overview/utils';

interface DashboardContainerProps {
	dashboard: DashboardtypesGettableDashboardV2DTO;
	refetch: () => void;
}

function DashboardContainer({
	dashboard,
	refetch,
}: DashboardContainerProps): JSX.Element {
<<<<<<< HEAD
	useEffect(() => {
		document.title = dashboard.name;
	}, [dashboard.name]);
=======
	const spec = dashboard.spec;
	const image = dashboard.image || Base64Icons[0];
	const name = spec.display.name;

	useEffect(() => {
		document.title = name;
	}, [name]);
>>>>>>> upstream/main

	const fullScreenHandle = useFullScreenHandle();

	const { user } = useAppContext();
	const [editDashboardPermission] = useComponentPermission(
		['edit_dashboard'],
		user.role,
	);

<<<<<<< HEAD
	// Publish edit context to the store so hooks/components read it from there
	// instead of receiving dashboardId/isEditable/refetch as props down the tree.
	const setEditContext = useDashboardStore((s) => s.setEditContext);
	useEffect(() => {
		setEditContext({
			dashboardId: dashboard.id,
			isEditable: !dashboard.locked && editDashboardPermission,
			refetch,
		});
	}, [
		dashboard.id,
		dashboard.locked,
		editDashboardPermission,
		refetch,
		setEditContext,
	]);

	const spec = dashboard.spec;
	const image = dashboard.image || Base64Icons[0];
	const name = spec.display.name;
=======
	// Seed during render (not an effect) so the first Panel render already sees the id —
	// useDashboardFetchRequired throws on a missing id. setEditContext self-guards.
	const setEditContext = useDashboardStore((s) => s.setEditContext);
	setEditContext({
		dashboardId: dashboard.id,
		isEditable: !dashboard.locked && editDashboardPermission,
		refetch,
	});

	// Resolve the variable selection into the V5 query payload and publish it to
	// the store, so each panel's query substitutes the bar's selected values.
	useResolvedVariables(dashboard);

	// Publish variables to the shared store so the query builder autocomplete
	// suggests them ($variable) in the panel editor and dashboards-page builder.
	useSyncVariablesForSuggestions(dashboard);
>>>>>>> upstream/main

	return (
		<FullScreen handle={fullScreenHandle}>
			<div className={styles.container}>
				<DashboardPageHeader title={name} image={image} />
				<DashboardPageToolbar
					dashboard={dashboard}
					handle={fullScreenHandle}
					refetch={refetch}
				/>
				<PanelsAndSectionsLayout layouts={spec.layouts} panels={spec.panels} />
			</div>
		</FullScreen>
	);
}

export default DashboardContainer;
