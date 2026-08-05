// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StepItem from './StepItem';
import { Ingredient } from '../../models/Ingredient';
import { Measurement } from '../../models/Measurement';

const makeIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
    id: 'ing-1',
    name: 'garlic',
    description: '',
    measurement: Measurement.Cloves,
    amount: 3,
    ...overrides,
});

test('renders title and description', () => {
    const { container } = render(
        <StepItem
            title="Chop vegetables"
            description="Chop all vegetables into small pieces."
            id="step-1"
            ingredients={[]}
            onRemove={vi.fn()}
            onUpdate={vi.fn()}
            onToggleIngredient={vi.fn()}
            readOnly={true}
        />
    );

    // Check inputs exist with correct values using container queries
    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const descTextarea = container.querySelector('#description') as HTMLTextAreaElement;
    expect(nameInput).toBeTruthy();
    expect(nameInput?.value).toBe('Chop vegetables');
    expect(descTextarea).toBeTruthy();
    expect(descTextarea?.value).toBe('Chop all vegetables into small pieces.');
});

test('calls onUpdate on blur', () => {
    const onUpdate = vi.fn();
    const { container } = render(
        <StepItem
            title="Step"
            description="Desc"
            id="step-1"
            ingredients={[]}
            onRemove={vi.fn()}
            onUpdate={onUpdate}
            onToggleIngredient={vi.fn()}
            readOnly={false}
        />
    );

    const titleInput = container.querySelector('#name') as HTMLInputElement;
    fireEvent.blur(titleInput);
    expect(onUpdate).toHaveBeenCalled();
});

test('shows delete button when not readOnly', () => {
    const { container } = render(
        <StepItem
            title="Step"
            description="Desc"
            id="step-1"
            ingredients={[]}
            onRemove={vi.fn()}
            onUpdate={vi.fn()}
            onToggleIngredient={vi.fn()}
            readOnly={false}
        />
    );

    expect(container.querySelector('.dinner-item-delete-action')).toBeTruthy();
});

test('hides delete button when readOnly', () => {
    const { container } = render(
        <StepItem
            title="Step"
            description="Desc"
            id="step-1"
            ingredients={[]}
            onRemove={vi.fn()}
            onUpdate={vi.fn()}
            onToggleIngredient={vi.fn()}
            readOnly={true}
        />
    );

    expect(container.querySelector('.dinner-item-delete-action')).toBeNull();
});

test('shows associated ingredients', () => {
    const ingredients = [
        makeIngredient({ id: 'ing-1', name: 'garlic', stepId: 'step-1' }),
        makeIngredient({ id: 'ing-2', name: 'onion' }),
    ];

    const { container } = render(
        <StepItem
            title="Sauté"
            description="Sauté garlic in oil."
            id="step-1"
            ingredients={ingredients}
            onRemove={vi.fn()}
            onUpdate={vi.fn()}
            onToggleIngredient={vi.fn()}
            readOnly={true}
        />
    );

    // Check the "Ingredients for this step" section shows garlic
    const stepSection = container.querySelector('.step-ingredients:not(.step-ingredients-available)');
    expect(stepSection).toBeTruthy();
    expect(stepSection!.textContent).toContain('garlic');
    // Available ingredients section should not appear in readOnly mode
    expect(container.querySelector('.step-ingredients-available')).toBeNull();
});
