export const toAbsoluteUrl = (url) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
    return `${base}${url}`;
};
