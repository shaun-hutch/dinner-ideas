// @vitest-environment jsdom
import { test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import * as Api from '../api/Api';

// Mock the API module
vi.mock('../api/Api', () => ({
    login: vi.fn(),
    register: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

test('provides null user when no stored token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
});

test('provides user when token in localStorage', () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    localStorage.setItem('dinner-ideas-token', 'mock-token');
    localStorage.setItem('dinner-ideas-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(result.current.isAuthenticated).toBe(true);
});

test('login sets user and token', async () => {
    const mockResponse = {
        token: 'login-token',
        user: { id: '1', email: 'login@test.com' },
    };
    vi.mocked(Api.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
        await result.current.login('login@test.com', 'password');
    });

    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.token).toBe('login-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('dinner-ideas-token')).toBe('login-token');
    expect(Api.login).toHaveBeenCalledWith('login@test.com', 'password');
});

test('register sets user and token', async () => {
    const mockResponse = {
        token: 'register-token',
        user: { id: '2', email: 'register@test.com' },
    };
    vi.mocked(Api.register).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
        await result.current.register('register@test.com', 'password');
    });

    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.token).toBe('register-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('dinner-ideas-token')).toBe('register-token');
    expect(Api.register).toHaveBeenCalledWith('register@test.com', 'password');
});

test('logout clears user and token', async () => {
    // First set up authenticated state
    localStorage.setItem('dinner-ideas-token', 'token');
    localStorage.setItem('dinner-ideas-user', JSON.stringify({ id: '1', email: 'test@test.com' }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
        result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('dinner-ideas-token')).toBeNull();
});
