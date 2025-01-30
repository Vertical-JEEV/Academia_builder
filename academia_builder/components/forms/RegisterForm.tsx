'use client';

import { useRegister } from '@/hooks';
import { Form } from '@/components/forms';

export default function RegisterForm() {
  const {
    first_name,
    last_name,
    email,
    account_type,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit
  } = useRegister();

  const config = [
    {
      labelId: 'first_name',
      type: 'text',
      value: first_name,
      required: true,
      autoComplete: 'given-name',
      placeholder: 'First Name'
    },
    {
      labelId: 'last_name',
      type: 'text',
      value: last_name,
      required: true,
      autoComplete: 'family-name',
      placeholder: 'Last Name'
    },
    {
      labelId: 'email',
      type: 'email',
      value: email,
      required: true,
      autoComplete: 'email',
      placeholder: 'Email'
    },
    {
      labelId: 'account_type',
      type: 'select',
      options: [
        { value: 'teacher', label: 'Teacher' },
        { value: 'student', label: 'Student' }
      ],
      value: account_type,
      required: true,
      placeholder: 'Select account type'
    },
    {
      labelId: 'password',
      type: 'password',
      value: password,
      required: true,
      autoComplete: 'new-password',
      placeholder: 'Password'
    },
    {
      labelId: 're_password',
      type: 'password',
      value: re_password,
      required: true,
      autoComplete: 'new-password',
      placeholder: 'Confirm Password'
    }
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Register"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}