import { useState, useCallback } from 'react';

/**
 * Extracted hook for form error state management.
 * Fowler: Extract Function — removes repeated error state boilerplate
 * from SignInPage, SignUpPage, and other form components.
 *
 * @returns {{ errors, setFieldError, clearErrors, setServerError }}
 */
const useFormError = () => {
    const [errors, setErrors] = useState({});

    const setFieldError = useCallback((field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    }, []);

    const clearErrors = useCallback(() => setErrors({}), []);

    const setServerError = useCallback((serverErrors) => {
        if (!serverErrors || typeof serverErrors !== 'object') return;
        const mapped = {};
        Object.entries(serverErrors).forEach(([key, val]) => {
            mapped[key] = Array.isArray(val) ? val[0] : String(val);
        });
        setErrors(mapped);
    }, []);

    return { errors, setFieldError, clearErrors, setServerError };
};

export default useFormError;
