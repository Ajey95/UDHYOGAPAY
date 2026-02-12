export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: FormErrors;
  touched: Record<string, boolean>;
}
