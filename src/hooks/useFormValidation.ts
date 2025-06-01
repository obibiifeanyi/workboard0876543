
import { useState, useCallback } from 'react';
import { z } from 'zod';

export const useFormValidation = <T>(schema: z.ZodSchema<T>) => {
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

  const validateField = useCallback(async (fieldName: string, value: any) => {
    try {
      // Create a partial schema for just this field
      const fieldSchema = schema.pick({ [fieldName]: true } as any);
      await fieldSchema.parseAsync({ [fieldName]: value });
      
      // Clear error for this field if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(fieldName));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }));
        }
      }
      return false;
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName];
  }, [errors]);

  return {
    validate,
    validateField,
    errors,
    isValidating,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};
