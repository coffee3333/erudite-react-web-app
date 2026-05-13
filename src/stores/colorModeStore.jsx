import { createContext, useContext, useState, useMemo } from 'react';

export const ColorModeContext = createContext({ mode: 'dark', toggleColorMode: () => {} });

export function ColorModeProvider({ children }) {
    const [mode, setMode] = useState(() => localStorage.getItem('colorMode') || 'dark');

    const toggleColorMode = () => {
        setMode(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('colorMode', next);
            document.documentElement.setAttribute('data-color-mode', next);
            return next;
        });
    };

    const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);

    return (
        <ColorModeContext.Provider value={value}>
            {children}
        </ColorModeContext.Provider>
    );
}

export const useColorMode = () => useContext(ColorModeContext);
