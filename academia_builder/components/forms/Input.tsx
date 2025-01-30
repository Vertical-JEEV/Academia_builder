import { ChangeEvent } from 'react';

interface InputFormProps {
    labelId: string;
    type: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    required?: boolean;
    autoComplete?: string;
    placeholder?: string;
}

export default function Input({
    labelId, 
    type, 
    onChange, 
    value, 
    required = false,
    autoComplete,
    placeholder
}: InputFormProps) {
    return (
        <div className="rounded-md shadow-sm">
            <input
            id={labelId}
            name={labelId}
            type={type}
            onChange={onChange}
            value = {value}
            required = {required}
            autoComplete= {autoComplete}
            placeholder={placeholder}
            className="block w-full rounded-t-md bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
            />
        </div>
    )
}