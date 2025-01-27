import { ChangeEvent } from 'react';

interface SelectProps {
  labelId: string;
  options: { value: string; label: string }[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string | string[];
  required?: boolean;
  multiple?: boolean;
  placeholder?: string;
}

export default function Select({
  labelId,
  options,
  onChange,
  value,
  required = false,
  multiple = false,
  placeholder
}: SelectProps) {
  return (
    <div className="rounded-md shadow-sm">
      <select
        id={labelId}
        name={labelId}
        onChange={onChange}
        value={value}
        required={required}
        multiple={multiple}
        className="block w-full bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
      >
        {placeholder && !multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}