import { renderHook } from '@testing-library/react';
<<<<<<< HEAD
import {
	getGetDashboardV2QueryKey,
	usePatchDashboardV2,
} from 'api/generated/services/dashboard';
=======
>>>>>>> upstream/main
import type { DashboardtypesPanelSpecDTO } from 'api/generated/services/sigNoz.schemas';

import { usePanelEditorSave } from '../usePanelEditorSave';

<<<<<<< HEAD
const mockInvalidateQueries = jest.fn();
jest.mock('react-query', () => ({
	useQueryClient: (): { invalidateQueries: jest.Mock } => ({
		invalidateQueries: mockInvalidateQueries,
=======
const mockPatchAsync = jest.fn().mockResolvedValue(undefined);
let mockIsPatching = false;
jest.mock('../../../hooks/useOptimisticPatch', () => ({
	useOptimisticPatch: (): {
		patchAsync: jest.Mock;
		isPatching: boolean;
		error: Error | null;
	} => ({ patchAsync: mockPatchAsync, isPatching: mockIsPatching, error: null }),
}));

// The hook reads getQueryData only for the isNew branch; a stub client is enough here.
jest.mock('react-query', () => ({
	useQueryClient: (): { getQueryData: jest.Mock } => ({
		getQueryData: jest.fn(),
>>>>>>> upstream/main
	}),
}));

jest.mock('api/generated/services/dashboard', () => ({
<<<<<<< HEAD
	usePatchDashboardV2: jest.fn(),
	getGetDashboardV2QueryKey: jest.fn(() => ['/api/v2/dashboards/dash-1']),
}));

const mockUsePatch = usePatchDashboardV2 as unknown as jest.Mock;
const mockGetQueryKey = getGetDashboardV2QueryKey as unknown as jest.Mock;

describe('usePanelEditorSave', () => {
	const mutateAsync = jest.fn().mockResolvedValue(undefined);

	beforeEach(() => {
		jest.clearAllMocks();
		mockUsePatch.mockReturnValue({
			mutateAsync,
			isLoading: false,
			error: null,
		});
	});

	it('emits an add patch replacing the whole panel spec and invalidates the dashboard query', async () => {
=======
	getGetDashboardV2QueryKey: jest.fn(() => ['/api/v2/dashboards/dash-1']),
}));

describe('usePanelEditorSave', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockIsPatching = false;
	});

	it('optimistically patches an add replacing the whole panel spec', async () => {
>>>>>>> upstream/main
		const { result } = renderHook(() =>
			usePanelEditorSave({ dashboardId: 'dash-1', panelId: 'panel-9' }),
		);

		const spec = {
			display: { name: 'New title', description: 'desc' },
			plugin: {
				kind: 'signoz/TimeSeriesPanel',
				spec: { formatting: { unit: 'bytes' } },
			},
			queries: [],
		} as unknown as DashboardtypesPanelSpecDTO;

		await result.current.save(spec);

<<<<<<< HEAD
		expect(mutateAsync).toHaveBeenCalledWith({
			pathParams: { id: 'dash-1' },
			data: [
				{
					op: 'add',
					path: '/spec/panels/panel-9/spec',
					value: spec,
				},
			],
		});
		expect(mockGetQueryKey).toHaveBeenCalledWith({ id: 'dash-1' });
		expect(mockInvalidateQueries).toHaveBeenCalledWith([
			'/api/v2/dashboards/dash-1',
		]);
	});

	it('surfaces the mutation loading state as isSaving', () => {
		mockUsePatch.mockReturnValue({
			mutateAsync,
			isLoading: true,
			error: null,
		});
=======
		expect(mockPatchAsync).toHaveBeenCalledWith([
			{
				op: 'add',
				path: '/spec/panels/panel-9/spec',
				value: spec,
			},
		]);
	});

	it('surfaces the patch in-flight state as isSaving', () => {
		mockIsPatching = true;
>>>>>>> upstream/main

		const { result } = renderHook(() =>
			usePanelEditorSave({ dashboardId: 'dash-1', panelId: 'panel-9' }),
		);

		expect(result.current.isSaving).toBe(true);
	});
});
