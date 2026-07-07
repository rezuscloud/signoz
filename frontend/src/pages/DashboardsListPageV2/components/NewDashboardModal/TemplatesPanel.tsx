import { useState } from 'react';
import { generatePath } from 'react-router-dom';
<<<<<<< HEAD
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';
import { toast } from '@signozhq/ui/sonner';
import { ExternalLink, LoaderCircle } from '@signozhq/icons';
import { AxiosError } from 'axios';
import cx from 'classnames';
import logEvent from 'api/common/logEvent';
import { createDashboardV2 } from 'api/generated/services/dashboard';
import ROUTES from 'constants/routes';
import { RequestDashboardBtn } from 'container/ListOfDashboard/RequestDashboardBtn';
import { useSafeNavigate } from 'hooks/useSafeNavigate';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';
import { openInNewTab } from 'utils/navigation';

import { normalizeToPostable } from './importUtils';
import JsonEditor from './JsonEditor';
import { useDashboardTemplates } from './templatesData';

import styles from './NewDashboardModal.module.scss';

// Browse the template gallery (mock data until the API lands): pick one on the
// left to preview its JSON on the right, then use it or open the docs.
function TemplatesPanel(): JSX.Element {
	const { safeNavigate } = useSafeNavigate();
	const { showErrorModal } = useErrorModal();
	const { data, isLoading } = useDashboardTemplates(true);
	const templates = data ?? [];

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	const selected = templates.find((t) => t.id === selectedId) ?? templates[0];

	const handleUse = async (): Promise<void> => {
		if (!selected) {
=======
import { toast } from '@signozhq/ui/sonner';
import { AxiosError } from 'axios';
import logEvent from 'api/common/logEvent';
import { createDashboardV2 } from 'api/generated/services/dashboard';
import ROUTES from 'constants/routes';
import DashboardTemplatesContent from 'container/ListOfDashboard/DashboardTemplates/DashboardTemplatesContent';
import { useSafeNavigate } from 'hooks/useSafeNavigate';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';

import styles from './NewDashboardModal.module.scss';

interface Props {
	onClose: () => void;
}

// Until the templates BE API lands, the V2 "From a template" tab embeds the V1
// template gallery inline (no modal-in-modal). The V1 templates are placeholders,
// so the action creates a blank dashboard.
function TemplatesPanel({ onClose }: Props): JSX.Element {
	const { safeNavigate } = useSafeNavigate();
	const { showErrorModal } = useErrorModal();
	const [creating, setCreating] = useState(false);

	const handleCreate = async (): Promise<void> => {
		if (creating) {
>>>>>>> upstream/main
			return;
		}
		try {
			setCreating(true);
<<<<<<< HEAD
			logEvent('Dashboard List: Use template clicked', { template: selected.id });
			const parsed = JSON.parse(selected.json) as Record<string, unknown>;
			const created = await createDashboardV2(normalizeToPostable(parsed));
=======
			logEvent('Dashboard List: Use template clicked', {});
			const created = await createDashboardV2({
				schemaVersion: 'v6',
				generateName: true,
				tags: null,
				spec: {
					display: { name: 'Sample Dashboard' },
					layouts: [],
					panels: {},
					variables: [],
				},
			});
			onClose();
>>>>>>> upstream/main
			safeNavigate(
				generatePath(ROUTES.DASHBOARD, { dashboardId: created.data.id }),
			);
		} catch (e) {
			showErrorModal(e as APIError);
<<<<<<< HEAD
			toast.error(
				(e as AxiosError).toString() || 'Failed to create from template',
			);
=======
			toast.error((e as AxiosError).toString() || 'Failed to create dashboard');
>>>>>>> upstream/main
			setCreating(false);
		}
	};

<<<<<<< HEAD
	if (isLoading) {
		return (
			<div className={styles.panel}>
				<div className={styles.loading}>
					<LoaderCircle size={18} className={styles.spinner} />
					<span>Loading templates…</span>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.panel}>
			<div className={styles.templatesLayout}>
				<div className={styles.templatesList}>
					{templates.map((template) => (
						<button
							key={template.id}
							type="button"
							className={cx(styles.templateItem, {
								[styles.templateItemActive]: selected?.id === template.id,
							})}
							data-testid={`template-${template.id}`}
							onClick={(): void => setSelectedId(template.id)}
						>
							<span className={styles.templateName}>{template.name}</span>
							<span className={styles.templateCat}>{template.category}</span>
						</button>
					))}
				</div>

				{selected && (
					<div className={styles.templatesPreview}>
						<div className={styles.previewHead}>
							<div>
								<Typography.Text className={styles.cardName}>
									{selected.name}
								</Typography.Text>
								<Typography.Text className={styles.cardDesc}>
									{selected.description}
								</Typography.Text>
							</div>
							<Button
								variant="ghost"
								color="secondary"
								size="sm"
								suffix={<ExternalLink size={13} />}
								onClick={(): void => openInNewTab(selected.href)}
								testId="template-docs"
							>
								Docs
							</Button>
						</div>

						<JsonEditor value={selected.json} readOnly height="240px" />

						<div className={styles.footer}>
							<Button
								variant="solid"
								color="primary"
								size="md"
								loading={creating}
								testId="use-template"
								onClick={(): void => {
									void handleUse();
								}}
							>
								Use template
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className={styles.requestRow}>
				<RequestDashboardBtn />
=======
	return (
		<div className={styles.panel}>
			<div className="new-dashboard-templates-modal">
				<DashboardTemplatesContent
					onCreateNewDashboard={(): void => {
						void handleCreate();
					}}
				/>
>>>>>>> upstream/main
			</div>
		</div>
	);
}

export default TemplatesPanel;
