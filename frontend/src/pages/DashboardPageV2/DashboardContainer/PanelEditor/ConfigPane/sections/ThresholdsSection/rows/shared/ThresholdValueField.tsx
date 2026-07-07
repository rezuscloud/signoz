<<<<<<< HEAD
=======
import { useEffect, useState } from 'react';
>>>>>>> upstream/main
import { Typography } from '@signozhq/ui/typography';
import { Input } from 'antd';

import styles from '../../ThresholdsSection.module.scss';

interface ThresholdValueFieldProps {
	testId: string;
	value: number;
	/** Receives the raw input string; the draft hook parses it. */
	onChange: (raw: string) => void;
}

/** Labelled numeric "Value" input, shared by every threshold variant. */
function ThresholdValueField({
	testId,
	value,
	onChange,
}: ThresholdValueFieldProps): JSX.Element {
<<<<<<< HEAD
=======
	const [raw, setRaw] = useState(String(value));

	useEffect(() => {
		setRaw((prev) => (Number(prev) === value ? prev : String(value)));
	}, [value]);

>>>>>>> upstream/main
	return (
		<div className={styles.field}>
			<Typography.Text className={styles.fieldLabel}>Value</Typography.Text>
			<Input
				data-testid={testId}
				type="number"
				placeholder="Value"
<<<<<<< HEAD
				value={value}
				onChange={(e): void => onChange(e.target.value)}
=======
				value={raw}
				onChange={(e): void => {
					setRaw(e.target.value);
					onChange(e.target.value);
				}}
>>>>>>> upstream/main
			/>
		</div>
	);
}

export default ThresholdValueField;
