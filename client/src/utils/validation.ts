// Input validation and sanitization utilities

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Password is strong' };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate number input
 */
export const isValidNumber = (value: string | number, min?: number, max?: number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
};

/**
 * Parse number safely with fallback
 */
export const parseNumberSafe = (value: string | number, fallback: number = 0): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? fallback : num;
};

/**
 * Parse integer safely with fallback
 */
export const parseIntSafe = (value: string | number, fallback: number = 0): number => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(num) ? fallback : num;
};

/**
 * Validate age input
 */
export const isValidAge = (age: number): boolean => {
  return isValidNumber(age, 13, 120);
};

/**
 * Validate weight input (kg)
 */
export const isValidWeight = (weight: number): boolean => {
  return isValidNumber(weight, 20, 300);
};

/**
 * Validate height input (cm)
 */
export const isValidHeight = (height: number): boolean => {
  return isValidNumber(height, 100, 250);
};

/**
 * Validate water intake (glasses)
 */
export const isValidWaterIntake = (intake: number): boolean => {
  return isValidNumber(intake, 0, 50);
};

/**
 * Trim and validate string
 */
export const validateString = (str: string, minLength: number = 1, maxLength: number = 1000): { valid: boolean; message: string; value: string } => {
  const trimmed = str.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, message: `Must be at least ${minLength} characters`, value: trimmed };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, message: `Must be no more than ${maxLength} characters`, value: trimmed };
  }
  
  return { valid: true, message: 'Valid', value: trimmed };
};

/**
 * Clean and validate array input
 */
export const validateArray = <T>(arr: unknown): arr is T[] => {
  return Array.isArray(arr);
};
