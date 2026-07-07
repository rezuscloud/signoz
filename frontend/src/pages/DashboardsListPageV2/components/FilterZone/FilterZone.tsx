<<<<<<< HEAD
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Button } from '@signozhq/ui/button';
import { X } from '@signozhq/icons';

import type { UpdatedWindow } from '../../types';
import SearchBar from '../SearchBar/SearchBar';
import FilterChips, { type CreatorOption } from './FilterChips';
=======
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';
import { X } from '@signozhq/icons';

import { buildSuggestionKeys } from '../../utils/dslSuggestions';
import type { SelectedTag, UpdatedWindow } from '../../types';
import SearchBar from '../SearchBar/SearchBar';
import FilterChips, { type CreatorOption } from './FilterChips';
import TagsFilterChip from './TagsFilterChip';
>>>>>>> upstream/main

import styles from './FilterZone.module.scss';

interface Props {
	search: string;
	createdBy: string[];
	updated: UpdatedWindow;
<<<<<<< HEAD
=======
	tags: SelectedTag[];
	availableTags: SelectedTag[];
>>>>>>> upstream/main
	creatorOptions: CreatorOption[];
	isEmpty: boolean;
	onSearchChange: (value: string) => void;
	onCreatedByChange: (emails: string[]) => void;
	onUpdatedChange: (window: UpdatedWindow) => void;
<<<<<<< HEAD
=======
	onTagsChange: (tags: SelectedTag[]) => void;
>>>>>>> upstream/main
	onClearAll: () => void;
	// Rendered at the end of the search row (e.g. the New Dashboard action).
	rightSlot?: ReactNode;
}

// The filter command zone: name search + structured chips (created-by, updated)
// + clear-all. Search is committed on submit/blur (matching the prior bar);
// chips apply immediately.
function FilterZone({
	search,
	createdBy,
	updated,
<<<<<<< HEAD
=======
	tags,
	availableTags,
>>>>>>> upstream/main
	creatorOptions,
	isEmpty,
	onSearchChange,
	onCreatedByChange,
	onUpdatedChange,
<<<<<<< HEAD
=======
	onTagsChange,
>>>>>>> upstream/main
	onClearAll,
	rightSlot,
}: Props): JSX.Element {
	const [searchInput, setSearchInput] = useState(search);

<<<<<<< HEAD
=======
	const suggestionKeys = useMemo(
		() => buildSuggestionKeys(availableTags),
		[availableTags],
	);

>>>>>>> upstream/main
	// Keep the local input in sync with external search changes (applying a view,
	// clear-all, back/forward). User typing only mutates the local copy.
	useEffect(() => {
		setSearchInput(search);
	}, [search]);

	const handleSubmit = useCallback((): void => {
		const next = searchInput.trim();
		if (next !== search) {
			onSearchChange(next);
		}
	}, [searchInput, search, onSearchChange]);

	return (
		<div className={styles.filterZone}>
			<div className={styles.searchRow}>
				<div className={styles.searchInput}>
					<SearchBar
						value={searchInput}
<<<<<<< HEAD
						placeholder="Search dashboards by name"
=======
						placeholder={`Search with DSL — e.g. name contains "prod" AND env = "staging"`}
						suggestionKeys={suggestionKeys}
>>>>>>> upstream/main
						onChange={setSearchInput}
						onSubmit={handleSubmit}
					/>
				</div>
				{rightSlot}
			</div>
			<div className={styles.filtersRow}>
<<<<<<< HEAD
				<span className={styles.filtersLabel}>Filters</span>
=======
				<Typography.Text className={styles.filtersLabel}>Filters</Typography.Text>
>>>>>>> upstream/main
				<FilterChips
					createdBy={createdBy}
					updated={updated}
					creatorOptions={creatorOptions}
					onCreatedByChange={onCreatedByChange}
					onUpdatedChange={onUpdatedChange}
				/>
<<<<<<< HEAD
				{!isEmpty && (
					<Button
						variant="ghost"
						color="secondary"
=======
				<TagsFilterChip
					availableTags={availableTags}
					tags={tags}
					onTagsChange={onTagsChange}
				/>
				{!isEmpty && (
					<Button
						variant="outlined"
						color="primary"
>>>>>>> upstream/main
						size="sm"
						prefix={<X size={12} />}
						onClick={onClearAll}
						testId="dashboards-filter-clear"
					>
						Clear
					</Button>
				)}
			</div>
		</div>
	);
}

export default FilterZone;
