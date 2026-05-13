import { describe, it, expect, vi, beforeEach } from 'vitest';

// Must mock import.meta.env before importing the module
vi.stubEnv('VITE_API_URL', 'https://api.example.com/api');

import { toAbsoluteUrl } from '../utils/imageUtils.js';

describe('toAbsoluteUrl', () => {
    it('returns undefined for null input', () => {
        expect(toAbsoluteUrl(null)).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
        expect(toAbsoluteUrl('')).toBeUndefined();
    });

    it('returns absolute URL unchanged', () => {
        expect(toAbsoluteUrl('https://cdn.example.com/photo.jpg')).toBe('https://cdn.example.com/photo.jpg');
    });

    it('returns http URL unchanged', () => {
        expect(toAbsoluteUrl('http://example.com/img.png')).toBe('http://example.com/img.png');
    });

    it('prepends base URL for relative path', () => {
        const result = toAbsoluteUrl('/media/photo.jpg');
        expect(result).toBe('https://api.example.com/media/photo.jpg');
    });
});
