
import { useState, useCallback } from 'react';
import { z } from 'zod';

export const useValidation = <T>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (data: any): Promise<{ isValid: boolean; data?: T; errors?: Record<string, string> }> => {
    setIsValidating(true);
    setErrors({});

    try {
      const validatedData = await schema.parseAsync(data);
      setIsValidating(false);
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>);
        
        setErrors(validationErrors);
        setIsValidating(false);
        return { isValid: false, errors: validationErrors };
      }
      
      setIsValidating(false);
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName];
  }, [errors]);

  return {
    validate,
    errors,
    isValidating,
    clearErrors,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};
