import { apiSlice } from "../services/apiSlice";

// Interface for User object
interface User {
  first_name: string;
  last_name: string;
  email: string;
  account_type: string;
}

// Interface for Google authentication arguments
interface SocialAuthenticateArgs {
  provider: string;
  state: string;
  code: string;
}

// Interface for Google authentication return type
interface SocialAuthenticateReturn {
  success: boolean;
  user: User;
}

// Interface for reset password arguments
interface ResetPasswordArgs {
  email: string;
}

// Interface for login arguments, extending reset password arguments
interface LoginArgs extends ResetPasswordArgs {
  password: string;
}

// Interface for register arguments, extending User interface
interface RegisterArgs extends User {
  password: string;
  re_password: string;
}

// Interface for activation arguments
interface ActivationArgs {
  uid: string;
  token: string;
}

// Interface for reset password confirm arguments
interface ResetPasswordConfirmArgs extends ActivationArgs {
  new_password: string;
  re_new_password: string;
}

// Inject endpoints into the apiSlice
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Retrieve user endpoint
    retrieveUser: builder.query<User, void>({
      query: () => "/users/me/",
    }),

    //Google authenticate endpoint
    SocialAuthenticate: builder.mutation<
      SocialAuthenticateReturn,
      SocialAuthenticateArgs
    >({
      query: ({ provider, state, code }) => ({
        url: `/o/${provider}/?state=${encodeURIComponent(
          state
        )}&code=${encodeURIComponent(code)}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),

    // Login endpoint
    login: builder.mutation<void, LoginArgs>({
      query: ({ email, password }) => ({
        url: "/jwt/create/",
        method: "POST",
        body: { email, password },
      }),
    }),

    // Register endpoint
    register: builder.mutation<void, RegisterArgs>({
      query: ({
        first_name,
        last_name,
        email,
        account_type,
        password,
        re_password,
      }) => ({
        url: "/users/",
        method: "POST",
        body: {
          first_name,
          last_name,
          email,
          account_type,
          password,
          re_password,
        },
      }),
    }),

    // Verify endpoint
    verify: builder.mutation({
      query: () => ({
        url: "/jwt/verify/",
        method: "POST",
      }),
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/logout/",
        method: "POST",
      }),
    }),

    // Activation endpoint
    activation: builder.mutation<void, ActivationArgs>({
      query: ({ uid, token }) => ({
        url: "/users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation<void, ResetPasswordArgs>({
      query: ({ email }) => ({
        url: "/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset password confirm endpoint
    resetPasswordConfirm: builder.mutation<void, ResetPasswordConfirmArgs>({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: "/users/reset_password_confirm/",
        method: "POST",
        body: { uid, token, new_password, re_new_password },
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useRetrieveUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;


