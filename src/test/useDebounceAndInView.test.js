import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce.jsx';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('useDebounce', () => {
    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 500));
        expect(result.current).toBe('hello');
    });

    it('does not update before delay', () => {
        const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
            initialProps: { val: 'a' },
        });
        rerender({ val: 'b' });
        act(() => { vi.advanceTimersByTime(300); });
        expect(result.current).toBe('a');
    });

    it('updates after delay', () => {
        const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
            initialProps: { val: 'a' },
        });
        rerender({ val: 'b' });
        act(() => { vi.advanceTimersByTime(500); });
        expect(result.current).toBe('b');
    });

    it('resets timer on rapid changes', () => {
        const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
            initialProps: { val: 'a' },
        });
        rerender({ val: 'b' });
        act(() => { vi.advanceTimersByTime(300); });
        rerender({ val: 'c' });
        act(() => { vi.advanceTimersByTime(300); });
        expect(result.current).toBe('a');
        act(() => { vi.advanceTimersByTime(200); });
        expect(result.current).toBe('c');
    });

    it('uses default delay of 500ms', () => {
        const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
            initialProps: { val: 'x' },
        });
        rerender({ val: 'y' });
        act(() => { vi.advanceTimersByTime(500); });
        expect(result.current).toBe('y');
    });
});
