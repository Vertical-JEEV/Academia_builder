import { ChangeEvent, FormEvent, ReactNode } from "react";
import { Input } from "@/components/forms";
import { Select } from "@/components/forms";
import { Spinner } from "@/components/common";

interface Config {
  labelId: string;
  type: string;
  value: string;
  required?: boolean;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  placeholder: string;
}

interface FormProps {
  config: Config[];
  isLoading: boolean;
  btnText: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
}

export default function Form({
  config,
  isLoading,
  btnText,
  onChange,
  onSubmit,
  children,
}: FormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {config.map((input) =>
        input.type === "select" ? (
          <Select
            key={input.labelId}
            labelId={input.labelId}
            options={input.options || []}
            onChange={onChange}
            value={input.value}
            required={input.required}
            multiple={input.multiple}
            placeholder={input.placeholder}
          />
        ) : (
          <Input
            key={input.labelId}
            labelId={input.labelId}
            type={input.type}
            onChange={onChange}
            value={input.value}
            required={input.required}
            autoComplete={input.autoComplete}
            placeholder={input.placeholder}
          />
        )
      )}
      {children}
      <div className="mt-4">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? <Spinner sm /> : btnText}
        </button>
      </div>
    </form>
  );
}
