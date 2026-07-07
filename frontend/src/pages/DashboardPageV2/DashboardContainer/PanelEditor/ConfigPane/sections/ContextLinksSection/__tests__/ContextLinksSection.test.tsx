import { fireEvent, render, screen } from '@testing-library/react';
import type { DashboardLinkDTO } from 'api/generated/services/sigNoz.schemas';

import ContextLinksSection from '../ContextLinksSection';

<<<<<<< HEAD
=======
// The variable-source hook reads the query-builder provider + store; stub it so the
// editor can be exercised in isolation (its own suite covers the sourcing logic).
jest.mock('../useContextLinkVariables', () => ({
	useContextLinkVariables: (): unknown => [
		{ name: 'timestamp_start', source: 'Global timestamp' },
		{ name: 'env', source: 'Dashboard variable' },
	],
}));

>>>>>>> upstream/main
const LINKS: DashboardLinkDTO[] = [
	{ name: 'Docs', url: 'https://signoz.io', targetBlank: true },
];

<<<<<<< HEAD
=======
const lastCall = (fn: jest.Mock): DashboardLinkDTO[] =>
	fn.mock.calls[fn.mock.calls.length - 1][0];

>>>>>>> upstream/main
describe('ContextLinksSection', () => {
	it('renders only the add button when there are no links', () => {
		render(<ContextLinksSection value={undefined} onChange={jest.fn()} />);

		expect(screen.getByTestId('panel-editor-v2-add-link')).toBeInTheDocument();
<<<<<<< HEAD
		expect(screen.queryByTestId('context-link-label-0')).not.toBeInTheDocument();
	});

	it('appends a blank link (open-in-new-tab on) when Add link is clicked', () => {
=======
		expect(screen.queryByTestId('context-link-item-0')).not.toBeInTheDocument();
	});

	it('renders existing links as list items showing the label', () => {
		render(<ContextLinksSection value={LINKS} onChange={jest.fn()} />);

		expect(screen.getByTestId('context-link-item-0')).toHaveTextContent('Docs');
		// The editor is a modal — no inline fields until it's opened.
		expect(screen.queryByTestId('context-link-url')).not.toBeInTheDocument();
	});

	it('adds a link through the dialog (Save gated on a valid URL)', async () => {
>>>>>>> upstream/main
		const onChange = jest.fn();
		render(<ContextLinksSection value={[]} onChange={onChange} />);

		fireEvent.click(screen.getByTestId('panel-editor-v2-add-link'));

<<<<<<< HEAD
		expect(onChange).toHaveBeenCalledWith([
			{ name: '', url: '', targetBlank: true },
		]);
	});

	it('renders existing links and edits a label through onChange', () => {
		const onChange = jest.fn();
		render(<ContextLinksSection value={LINKS} onChange={onChange} />);

		expect(screen.getByTestId('context-link-label-0')).toHaveValue('Docs');
		expect(screen.getByTestId('context-link-url-0')).toHaveValue(
			'https://signoz.io',
		);

		fireEvent.change(screen.getByTestId('context-link-label-0'), {
			target: { value: 'Runbook' },
		});
		expect(onChange).toHaveBeenCalledWith([
			{ name: 'Runbook', url: 'https://signoz.io', targetBlank: true },
		]);
	});

	it('removes a link through onChange', () => {
=======
		const save = await screen.findByTestId('context-link-save');
		expect(save).toBeDisabled();

		fireEvent.change(screen.getByTestId('context-link-url'), {
			target: { value: 'https://signoz.io' },
		});
		fireEvent.change(screen.getByTestId('context-link-label'), {
			target: { value: 'Docs' },
		});
		expect(save).not.toBeDisabled();

		fireEvent.click(save);
		expect(onChange).toHaveBeenCalledWith([
			{
				name: 'Docs',
				url: 'https://signoz.io',
				targetBlank: true,
				renderVariables: true,
			},
		]);
	});

	it('edits an existing link through the dialog', async () => {
		const onChange = jest.fn();
		render(<ContextLinksSection value={LINKS} onChange={onChange} />);

		fireEvent.click(screen.getByTestId('context-link-edit-0'));

		const label = await screen.findByTestId('context-link-label');
		expect(label).toHaveValue('Docs');
		expect(screen.getByTestId('context-link-url')).toHaveValue(
			'https://signoz.io',
		);

		fireEvent.change(label, { target: { value: 'Runbook' } });
		fireEvent.click(screen.getByTestId('context-link-save'));

		expect(onChange).toHaveBeenCalledWith([
			{
				name: 'Runbook',
				url: 'https://signoz.io',
				targetBlank: true,
				renderVariables: true,
			},
		]);
	});

	it('removes a link from the list', () => {
>>>>>>> upstream/main
		const onChange = jest.fn();
		render(<ContextLinksSection value={LINKS} onChange={onChange} />);

		fireEvent.click(screen.getByTestId('context-link-remove-0'));

		expect(onChange).toHaveBeenCalledWith([]);
	});
<<<<<<< HEAD
=======

	it('shows a validation error only for a malformed URL', async () => {
		render(<ContextLinksSection value={[]} onChange={jest.fn()} />);
		fireEvent.click(screen.getByTestId('panel-editor-v2-add-link'));

		const urlInput = await screen.findByTestId('context-link-url');

		fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
		expect(screen.getByTestId('context-link-url-error')).toBeInTheDocument();
		expect(screen.getByTestId('context-link-save')).toBeDisabled();

		fireEvent.change(urlInput, { target: { value: '/valid/path' } });
		expect(
			screen.queryByTestId('context-link-url-error'),
		).not.toBeInTheDocument();
	});

	it('adds a URL parameter and writes it into the URL query string', async () => {
		const onChange = jest.fn();
		render(<ContextLinksSection value={[]} onChange={onChange} />);
		fireEvent.click(screen.getByTestId('panel-editor-v2-add-link'));

		fireEvent.change(await screen.findByTestId('context-link-url'), {
			target: { value: '/logs' },
		});
		fireEvent.click(screen.getByTestId('context-link-add-param'));
		fireEvent.change(screen.getByTestId('context-link-param-key-0'), {
			target: { value: 'env' },
		});
		fireEvent.click(screen.getByTestId('context-link-save'));

		expect(lastCall(onChange)).toStrictEqual([
			{ name: '', url: '/logs?env=', targetBlank: true, renderVariables: true },
		]);
	});

	it('inserts a {{variable}} into the URL from the autocomplete popover', async () => {
		render(<ContextLinksSection value={[]} onChange={jest.fn()} />);
		fireEvent.click(screen.getByTestId('panel-editor-v2-add-link'));

		const urlInput = await screen.findByTestId('context-link-url');
		fireEvent.focus(urlInput);
		fireEvent.click(
			await screen.findByTestId('context-link-variable-timestamp_start'),
		);

		expect(urlInput).toHaveValue('{{timestamp_start}}');
	});
>>>>>>> upstream/main
});
