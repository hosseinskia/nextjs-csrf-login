import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string | FieldError;
}

export default function Input({ id, type, label, placeholder, register, error }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        className={`block w-full rounded-lg border-gray-300 shadow-sm input-focus ${
          error ? 'border-red-500' : ''
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-red-600">{typeof error === 'string' ? error : error.message}</p>}
    </div>
  );
}