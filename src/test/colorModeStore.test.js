import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ColorModeContext, ColorModeProvider, useColorMode } from '../stores/colorModeStore.jsx';

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

describe('colorModeStore', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-color-mode');
    });

    it('default mode is dark when nothing in localStorage', () => {
        const { result } = renderHook(() => useColorMode(), {
            wrapper: ColorModeProvider,
        });
        expect(result.current.mode).toBe('dark');
    });

    it('reads initial mode from localStorage', () => {
        localStorage.setItem('colorMode', 'light');
        const { result } = renderHook(() => useColorMode(), {
            wrapper: ColorModeProvider,
        });
        expect(result.current.mode).toBe('light');
    });

    it('toggleColorMode switches from dark to light', () => {
        const { result } = renderHook(() => useColorMode(), {
            wrapper: ColorModeProvider,
        });
        act(() => {
            result.current.toggleColorMode();
        });
        expect(result.current.mode).toBe('light');
    });

    it('toggleColorMode persists mode to localStorage', () => {
        const { result } = renderHook(() => useColorMode(), {
            wrapper: ColorModeProvider,
        });
        act(() => {
            result.current.toggleColorMode();
        });
        expect(localStorage.getItem('colorMode')).toBe('light');
    });

    it('toggleColorMode switches back to dark', () => {
        localStorage.setItem('colorMode', 'light');
        const { result } = renderHook(() => useColorMode(), {
            wrapper: ColorModeProvider,
        });
        act(() => {
            result.current.toggleColorMode();
        });
        expect(result.current.mode).toBe('dark');
    });
});
