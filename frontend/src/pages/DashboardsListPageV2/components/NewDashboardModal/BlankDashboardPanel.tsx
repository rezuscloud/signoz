import { type ChangeEvent, useState } from 'react';
// eslint-disable-next-line signoz/no-antd-components -- no @signozhq/ui multiline TextArea yet
import { Input as AntInput } from 'antd';
import { Button } from '@signozhq/ui/button';
import { Input } from '@signozhq/ui/input';
import { Typography } from '@signozhq/ui/typography';
import { toast } from '@signozhq/ui/sonner';
import { AxiosError } from 'axios';
import { generatePath } from 'react-router-dom';
import logEvent from 'api/common/logEvent';
import { createDashboardV2 } from 'api/generated/services/dashboard';
import ROUTES from 'constants/routes';
import { useSafeNavigate } from 'hooks/useSafeNavigate';
import { useErrorModal } from 'providers/ErrorModalProvider';
import APIError from 'types/api/error';
<<<<<<< HEAD

import { toPostableTags } from '../../utils';

=======
import TagKeyValueInput from 'components/TagKeyValueInput/TagKeyValueInput';

import { keyValueStringsToTags } from '../../utils/helpers';

import { DASHBOARD_NAME_MAX_LENGTH } from '../../../DashboardPageV2/DashboardContainer/constants';
>>>>>>> upstream/main
import styles from './NewDashboardModal.module.scss';

const DEFAULT_NAME = 'Sample Dashboard';

interface Props {
	onClose: () => void;
}

function BlankDashboardPanel({ onClose }: Props): JSX.Element {
	const { safeNavigate } = useSafeNavigate();
	const { showErrorModal } = useErrorModal();

	const [name, setName] = useState(DEFAULT_NAME);
	const [description, setDescription] = useState('');
<<<<<<< HEAD
	const [tags, setTags] = useState('');
=======
	const [tags, setTags] = useState<string[]>([]);
>>>>>>> upstream/main
	const [submitting, setSubmitting] = useState(false);

	const canSubmit = name.trim().length > 0 && !submitting;

	const handleCreate = async (): Promise<void> => {
		if (!canSubmit) {
			return;
		}
		try {
			setSubmitting(true);
			logEvent('Dashboard List: Create dashboard clicked', {});
<<<<<<< HEAD
			const postableTags = toPostableTags(tags);
=======
			const postableTags = keyValueStringsToTags(tags);
>>>>>>> upstream/main
			const created = await createDashboardV2({
				schemaVersion: 'v6',
				generateName: true,
				tags: postableTags.length ? postableTags : null,
				spec: {
					display: {
						name: name.trim(),
						description: description.trim() || undefined,
					},
					layouts: [],
					panels: {},
					variables: [],
				},
			});
<<<<<<< HEAD
=======
			onClose();
>>>>>>> upstream/main
			safeNavigate(
				generatePath(ROUTES.DASHBOARD, { dashboardId: created.data.id }),
			);
		} catch (e) {
			showErrorModal(e as APIError);
			toast.error((e as AxiosError).toString() || 'Failed to create dashboard');
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.panel}>
			<div className={styles.form}>
				<div className={styles.field}>
					<Typography.Text className={styles.label}>
<<<<<<< HEAD
						Title <span className={styles.required}>*</span>
=======
						Title <Typography.Text className={styles.required}>*</Typography.Text>
>>>>>>> upstream/main
					</Typography.Text>
					<Input
						value={name}
						autoFocus
<<<<<<< HEAD
=======
						maxLength={DASHBOARD_NAME_MAX_LENGTH}
>>>>>>> upstream/main
						placeholder="e.g. Sample Dashboard"
						testId="create-dashboard-name"
						onChange={(e: ChangeEvent<HTMLInputElement>): void =>
							setName(e.target.value)
						}
						onKeyDown={(e): void => {
							if (e.key === 'Enter') {
								void handleCreate();
							}
						}}
					/>
				</div>

				<div className={styles.field}>
					<Typography.Text className={styles.label}>Description</Typography.Text>
					{/* eslint-disable-next-line signoz/no-antd-components -- no @signozhq TextArea yet */}
					<AntInput.TextArea
						value={description}
						rows={3}
						placeholder="What is this dashboard for?"
						data-testid="create-dashboard-description"
						onChange={(e): void => setDescription(e.target.value)}
					/>
				</div>

				<div className={styles.field}>
					<Typography.Text className={styles.label}>Tags</Typography.Text>
<<<<<<< HEAD
					<Input
						value={tags}
						placeholder="team:jarvis, prod"
						testId="create-dashboard-tags"
						onChange={(e: ChangeEvent<HTMLInputElement>): void =>
							setTags(e.target.value)
						}
					/>
					<Typography.Text className={styles.hint}>
						Comma-separated. Use key:value (e.g. team:jarvis) or a single label.
=======
					<TagKeyValueInput
						tags={tags}
						onTagsChange={setTags}
						placeholder="team:jarvis (press Enter)"
						testId="create-dashboard-tags"
					/>
					<Typography.Text className={styles.hint}>
						Use key:value (e.g. team:jarvis) and press Enter to add.
>>>>>>> upstream/main
					</Typography.Text>
				</div>
			</div>

			<div className={styles.footer}>
				<Button
					variant="ghost"
					color="secondary"
					size="md"
					onClick={onClose}
					testId="create-dashboard-cancel"
				>
					Cancel
				</Button>
				<Button
					variant="solid"
					color="primary"
					size="md"
					disabled={!canSubmit}
					testId="create-dashboard-submit"
					onClick={(): void => {
						void handleCreate();
					}}
				>
					Create dashboard
				</Button>
			</div>
		</div>
	);
}

export default BlankDashboardPanel;
