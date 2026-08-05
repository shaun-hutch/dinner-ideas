// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

// Mock the API to prevent real network requests
vi.mock('./api/Api', () => ({
    getAll: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
    add: vi.fn(),
    generateItems: vi.fn().mockResolvedValue([]),
    getUploadUrl: vi.fn(),
    uploadToS3: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    remove: vi.fn(),
    seedRecipes: vi.fn(),
    getRandomMeal: vi.fn(),
    searchMeals: vi.fn(),
    getMealCategories: vi.fn(),
    importMeal: vi.fn(),
}));

// createBrowserRouter triggers startNavigation → new Request()
// which hits a Node.js undici AbortSignal bug in jsdom.
// Mocking RouterProvider to render null avoids this entirely.
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        RouterProvider: () => null,
    };
});

import App from './App';

test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
});
