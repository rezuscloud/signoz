<<<<<<< HEAD
import { Plus, Trash2 } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Switch } from '@signozhq/ui/switch';
import { Typography } from '@signozhq/ui/typography';
import { Input } from 'antd';
import type { DashboardLinkDTO } from 'api/generated/services/sigNoz.schemas';
import type { SectionEditorProps } from 'pages/DashboardPageV2/DashboardContainer/Panels/types/sections';
=======
import { useState } from 'react';
import { Plus } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import type { DashboardLinkDTO } from 'api/generated/services/sigNoz.schemas';
import type {
	SectionEditorProps,
	SectionKind,
} from 'pages/DashboardPageV2/DashboardContainer/Panels/types/sections';

import ContextLinkDialog from './ContextLinkDialog';
import ContextLinkListItem from './ContextLinkListItem';
import { useContextLinkVariables } from './useContextLinkVariables';
>>>>>>> upstream/main

import styles from './ContextLinksSection.module.scss';

/**
<<<<<<< HEAD
 * Edits the panel's context links (`spec.links`): a list of label + URL rows with an
 * "open in new tab" toggle, plus add/remove. Atomic section — no per-kind sub-controls.
 * URLs may reference dashboard/query variables; that interpolation is resolved at render
 * time, so this editor just captures the raw strings.
=======
 * Edits the panel's context links (`spec.links`) as a list of saved links, each added or
 * edited through a modal ({@link ContextLinkDialog}) that carries V1's full authoring UX
 * (variable autocomplete, URL-parameters editor, validation).
>>>>>>> upstream/main
 */
function ContextLinksSection({
	value,
	onChange,
<<<<<<< HEAD
}: SectionEditorProps<'contextLinks'>): JSX.Element {
	const links = value ?? [];

	const updateAt = (index: number, patch: Partial<DashboardLinkDTO>): void =>
		onChange(
			links.map((link, i) => (i === index ? { ...link, ...patch } : link)),
		);

	const addLink = (): void =>
		onChange([...links, { name: '', url: '', targetBlank: true }]);
=======
}: SectionEditorProps<SectionKind.ContextLinks>): JSX.Element {
	const links = value ?? [];
	const variables = useContextLinkVariables();

	// `index === null` while adding a new link; a number while editing an existing one.
	const [dialog, setDialog] = useState<{ open: boolean; index: number | null }>({
		open: false,
		index: null,
	});
>>>>>>> upstream/main

	const removeAt = (index: number): void =>
		onChange(links.filter((_, i) => i !== index));

<<<<<<< HEAD
	return (
		<div className={styles.list}>
			{links.map((link, index) => (
				// Links have no stable id on the wire; index is the row identity here.
				// eslint-disable-next-line react/no-array-index-key
				<div className={styles.row} key={index}>
					<Input
						data-testid={`context-link-label-${index}`}
						placeholder="Label"
						value={link.name ?? ''}
						onChange={(e): void => updateAt(index, { name: e.target.value })}
					/>
					<Input
						data-testid={`context-link-url-${index}`}
						placeholder="https://… or /path?var=$variable"
						value={link.url ?? ''}
						onChange={(e): void => updateAt(index, { url: e.target.value })}
					/>
					<div className={styles.rowFooter}>
						<div className={styles.newTab}>
							<Switch
								testId={`context-link-newtab-${index}`}
								value={link.targetBlank ?? false}
								onChange={(checked: boolean): void =>
									updateAt(index, { targetBlank: checked })
								}
							/>
							<Typography.Text className={styles.newTabLabel}>
								Open in new tab
							</Typography.Text>
						</div>
						<Button
							type="button"
							variant="ghost"
							color="destructive"
							size="icon"
							aria-label={`Remove link ${index + 1}`}
							data-testid={`context-link-remove-${index}`}
							onClick={(): void => removeAt(index)}
						>
							<Trash2 size={14} />
						</Button>
					</div>
				</div>
=======
	const handleSave = (link: DashboardLinkDTO): void => {
		onChange(
			dialog.index === null
				? [...links, link]
				: links.map((existing, i) => (i === dialog.index ? link : existing)),
		);
		setDialog((d) => ({ ...d, open: false }));
	};

	const editingLink =
		dialog.index !== null ? (links[dialog.index] ?? null) : null;

	return (
		<div className={styles.list}>
			{links.map((link, index) => (
				<ContextLinkListItem
					// Links have no stable id on the wire; index is the row identity here.
					// eslint-disable-next-line react/no-array-index-key
					key={index}
					link={link}
					index={index}
					onEdit={(): void => setDialog({ open: true, index })}
					onRemove={(): void => removeAt(index)}
				/>
>>>>>>> upstream/main
			))}

			<Button
				type="button"
				variant="dashed"
				color="secondary"
				prefix={<Plus size={14} />}
				data-testid="panel-editor-v2-add-link"
<<<<<<< HEAD
				onClick={addLink}
			>
				Add link
			</Button>
=======
				onClick={(): void => setDialog({ open: true, index: null })}
			>
				Add Context Link
			</Button>

			<ContextLinkDialog
				open={dialog.open}
				initialLink={editingLink}
				variables={variables}
				onOpenChange={(open): void => setDialog((d) => ({ ...d, open }))}
				onSave={handleSave}
			/>
>>>>>>> upstream/main
		</div>
	);
}

export default ContextLinksSection;
