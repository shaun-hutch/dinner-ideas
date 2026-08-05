// @vitest-environment jsdom
import { test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDiinnerItemListContext, DinnerItemContext } from '../hooks/useDinnerItemListContext';
import * as Api from '../api/Api';
import { DinnerItem } from '../models/DinnerItem';

vi.mock('../api/Api', () => ({
    getAll: vi.fn(),
}));

const makeItem = (id: string, name: string): DinnerItem => ({
    id,
    typeAndId: `DinnerItem|${id}`,
    name,
    description: 'Test desc',
    prepTime: 10,
    cookTime: 20,
    steps: [],
    tags: [],
    ingredients: [],
    createdBy: 1,
    lastModifiedBy: 1,
    createdDate: new Date(),
    lastModifiedDate: new Date(),
    version: 1,
});

beforeEach(() => {
    vi.clearAllMocks();
});

test('getDinnerItem returns item when found', async () => {
    const items = [makeItem('id-1', 'Recipe 1'), makeItem('id-2', 'Recipe 2')];
    vi.mocked(Api.getAll).mockResolvedValue(items);

    const { result } = renderHook(() => useDiinnerItemListContext());

    // Wait for async loading to complete
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.getDinnerItem('id-1')).toEqual(items[0]);
});

test('getDinnerItem returns undefined when not found', () => {
    const items = [makeItem('id-1', 'Recipe 1')];
    vi.mocked(Api.getAll).mockResolvedValue(items);

    const { result } = renderHook(() => useDiinnerItemListContext());

    expect(result.current.getDinnerItem('nonexistent')).toBeUndefined();
});

test('updateDinnerItem updates item in list', async () => {
    const items = [makeItem('id-1', 'Original')];
    vi.mocked(Api.getAll).mockResolvedValue(items);

    const { result } = renderHook(() => useDiinnerItemListContext());

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    act(() => {
        result.current.updateDinnerItem!({ ...items[0], name: 'Updated' });
    });

    const updated = result.current.getDinnerItem('id-1');
    expect(updated?.name).toBe('Updated');
});

test('addDinnerItem adds to end of list', async () => {
    const items = [makeItem('id-1', 'First')];
    vi.mocked(Api.getAll).mockResolvedValue(items);

    const { result } = renderHook(() => useDiinnerItemListContext());

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    const newItem = makeItem('id-2', 'Second');

    act(() => {
        result.current.addDinnerItem!(newItem);
    });

    expect(result.current.dinnerItemList).toHaveLength(2);
    expect(result.current.dinnerItemList[1].name).toBe('Second');
});

test('loading is true initially', () => {
    vi.mocked(Api.getAll).mockResolvedValue([]);

    const { result } = renderHook(() => useDiinnerItemListContext());

    expect(result.current.loading).toBe(true);
});
