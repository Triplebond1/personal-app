// Validate type specific non required fields
export const validateField = (field: any, fieldType: string) => {
  if (field && typeof field !== fieldType) {
    return false;
  }
  return true;
};

// Validate required fields
export const validateRequiredField = (field: any, fieldType: string) => {
  if (!field || typeof field !== fieldType) {
    return false;
  }
  return true;
};

// Validate email field
export const validateEmail = (email: string) => {
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
  }
  return true;
};

// Password validation strength
export const validatePassword = (password: string) => {
  if (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return false;
    }
  }
  return true;
};

// Validate array fields
export const validateAllowedField = (field: any, allowedValues: string[]) => {
  if (field) {
    if (allowedValues && !allowedValues.includes(field)) {
      return false;
    }
  }
  return true;
};
