// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
