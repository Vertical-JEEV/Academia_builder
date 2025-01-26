export default function Example() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Log into your account
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST">
            <div className="rounded-md shadow-sm">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email address"
                className="block w-full rounded-t-md bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                className="block w-full rounded-b-md bg-white px-3 py-2 text-base text-gray-900 font-semibold border border-gray-500 border-t-0 placeholder-gray-400 placeholder:font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
            </div>

            {/* Remember me and Forgot password section */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-gray-900">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign up now
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

