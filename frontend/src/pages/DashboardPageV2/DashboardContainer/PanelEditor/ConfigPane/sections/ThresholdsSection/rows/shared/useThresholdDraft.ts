import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import useDebouncedFn from 'hooks/useDebouncedFunction';
>>>>>>> upstream/main

interface ThresholdDraft<T> {
	draft: T;
	setDraft: Dispatch<SetStateAction<T>>;
	/** Parse a raw input string into `value`, ignoring transient non-numeric input. */
	setValue: (raw: string) => void;
}

<<<<<<< HEAD
/**
 * Local draft for a threshold row, shared by every variant. Snapshots the saved
 * threshold on each entry into edit mode (so Discard simply drops the draft and the
 * next edit starts clean) and exposes the numeric `value` setter all variants use.
=======
const LIVE_PREVIEW_DEBOUNCE_MS = 150;

/**
 * Local draft for a threshold row, shared by every variant. Snapshots the saved
 * threshold on each entry into edit mode and exposes the numeric `value` setter all
 * variants use. `onLiveChange` mirrors the draft into the spec as the user edits, so the
 * panel preview updates live (without Save); the section reverts it on Discard.
>>>>>>> upstream/main
 */
export function useThresholdDraft<T extends { value: number }>(
	threshold: T,
	isEditing: boolean,
<<<<<<< HEAD
): ThresholdDraft<T> {
	const [draft, setDraft] = useState<T>(threshold);

=======
	onLiveChange?: (draft: T) => void,
): ThresholdDraft<T> {
	const [draft, setDraft] = useState<T>(threshold);

	const emitLiveChange = useDebouncedFn((next) => {
		onLiveChange?.(next as T);
	}, LIVE_PREVIEW_DEBOUNCE_MS);

>>>>>>> upstream/main
	useEffect(() => {
		if (isEditing) {
			setDraft(threshold);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- snapshot only on edit entry
	}, [isEditing]);

<<<<<<< HEAD
=======
	useEffect(() => {
		if (isEditing) {
			emitLiveChange(draft);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- propagate on draft change only
	}, [draft]);

	useEffect(() => {
		if (!isEditing) {
			emitLiveChange.cancel();
		}
		return (): void => emitLiveChange.cancel();
	}, [isEditing, emitLiveChange]);

>>>>>>> upstream/main
	const setValue = (raw: string): void => {
		const next = Number(raw);
		setDraft((d) => ({ ...d, value: Number.isNaN(next) ? d.value : next }));
	};

	return { draft, setDraft, setValue };
}
