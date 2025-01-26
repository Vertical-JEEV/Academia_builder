'use client';

import Link from 'next/link';
import Spinner from '@/components/common/Spinner';
import { useRegister } from '@/hooks';

export default function Register() {
  const { first_name, last_name, email, account_type, password, re_password, isLoading, onChange, onSubmit } = useRegister();
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Academia Builder"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Register for an account
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="rounded-md shadow-sm">
              <input
                id="first_name"
                name="first_name"
                type="text"
                onChange={onChange}
                value = {first_name}
                required
                autoComplete="given-name"
                placeholder="First Name"
                className="block w-full rounded-t-md bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
              <input
                id="last_name"
                name="last_name"
                type="text"
                onChange={onChange}
                value = {last_name}
                required
                autoComplete="family-name"
                placeholder="Last Name"
                className="block w-full bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
              <input
                id="email"
                name="email"
                type="email"
                onChange={onChange}
                value = {email}
                required
                autoComplete="email"
                placeholder="Email Address"
                className="block w-full bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
              <select
                id="account_type"
                name="account_type"
                onChange={onChange}
                value = {account_type}
                required
                className="block w-full bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              >
                <option value="" disabled>
                  Select Account Type
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>

              <input
                id="password"
                name="password"
                type="password"
                onChange={onChange}
                value = {password}
                required
                autoComplete="new-password"
                placeholder="Password"
                className="block w-full bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
              <input
                id="re_password"
                name="re_password"
                type="password"
                onChange={onChange}
                value = {re_password}
                required
                autoComplete="new-password"
                placeholder="Confirm Password"
                className="block w-full rounded-b-md bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
            </div>

           
            <div className="mt-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? <Spinner sm /> : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
