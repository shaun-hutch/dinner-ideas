// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DinnerListItem from './DinnerListItem';
import { FoodTag } from '../../models/FoodTag';

test('renders name and total time', () => {
    const { container } = render(
        <MemoryRouter>
            <DinnerListItem
                isLoading={false}
                id="test-id"
                name="Test Recipe"
                totalTime={35}
                tags={[FoodTag.Quick]}
                onClick={vi.fn()}
                onEditButtonClick={vi.fn()}
            />
        </MemoryRouter>
    );

    // PrimeReact Card renders the title in the header
    const cardTitle = container.querySelector('.p-card-title');
    expect(cardTitle).toBeTruthy();
    expect(cardTitle?.textContent).toBe('Test Recipe');

    // Subtitle shows total time
    const cardSubtitle = container.querySelector('.p-card-subtitle');
    expect(cardSubtitle?.textContent).toBe('35 mins');
});

test('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    const { container } = render(
        <MemoryRouter>
            <DinnerListItem
                isLoading={false}
                id="test-id"
                name="Test Recipe"
                totalTime={35}
                tags={[FoodTag.Quick]}
                onClick={onClick}
                onEditButtonClick={vi.fn()}
            />
        </MemoryRouter>
    );

    // Click the card container (the outer div with onClick)
    const card = container.querySelector('.p-card');
    expect(card).toBeTruthy();
    fireEvent.click(card!);
    expect(onClick).toHaveBeenCalledWith('test-id');
});

test('calls onEditButtonClick when edit button is clicked', () => {
    const onEdit = vi.fn();
    const { container } = render(
        <MemoryRouter>
            <DinnerListItem
                isLoading={false}
                id="test-id"
                name="Test Recipe"
                totalTime={35}
                tags={[FoodTag.Quick]}
                onClick={vi.fn()}
                onEditButtonClick={onEdit}
            />
        </MemoryRouter>
    );

    // Find the edit button by its icon class
    const editBtn = container.querySelector('.edit-button');
    expect(editBtn).toBeTruthy();
    fireEvent.click(editBtn!);
    expect(onEdit).toHaveBeenCalledWith('test-id');
});

test('renders with no tags', () => {
    const { container } = render(
        <MemoryRouter>
            <DinnerListItem
                isLoading={false}
                id="test-id"
                name="Simple Recipe"
                totalTime={10}
                tags={[]}
                onClick={vi.fn()}
                onEditButtonClick={vi.fn()}
            />
        </MemoryRouter>
    );

    const cardTitle = container.querySelector('.p-card-title');
    expect(cardTitle?.textContent).toBe('Simple Recipe');
});
