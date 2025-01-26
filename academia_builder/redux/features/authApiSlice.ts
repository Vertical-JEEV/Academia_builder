import { apiSlice } from '../services/apiSlice';

interface User {
	first_name: string;
	last_name: string;
	email: string;
    account_type: string;
}

interface GoogleAuthenticateArgs {
    state: string;
    code: string;
}

interface GoogleAuthenticateReturn {
    success: boolean;
    user: User;
}

interface ResetPasswordArgs {
    email: string;
}

interface LoginArgs extends ResetPasswordArgs {
    password: string;
}

interface RegisterArgs extends User {
    password: string;
    re_password: string;
}

interface ActivationArgs {
    uid: string;
    token: string;
}

interface ResetPasswordConfirmArgs {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}

const authApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({

        // <InterfaceName>: <ReturnType>, <ArgumentType>
		retrieveUser: builder.query<User, void>({
			query: () => '/users/me/',
		}),
		googleAuthenticate: builder.mutation<GoogleAuthenticateReturn, GoogleAuthenticateArgs>({
			query: ({ state, code }) => ({
				url: `/o/google-oauth2/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}),
		}),
		login: builder.mutation<void, LoginArgs>({
			query: ({ email, password }) => ({
				url: '/jwt/create/',
				method: 'POST',
				body: { email, password },
			}),
		}),
		register: builder.mutation<void, RegisterArgs>({
			query: ({
				first_name,
				last_name,
				email,
                account_type,
				password,
				re_password,    
			}) => ({
				url: '/users/',
				method: 'POST',
				body: { first_name, last_name, email, account_type, password, re_password },
			}),
		}),
		verify: builder.mutation({
			query: () => ({
				url: '/jwt/verify/',
				method: 'POST',
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: '/logout/',
				method: 'POST', 
			}),
		}),
		activation: builder.mutation<void, ActivationArgs>({
			query: ({ uid, token }) => ({
				url: '/users/activation/',
				method: 'POST',
				body: { uid, token },
			}),
		}),
		resetPassword: builder.mutation<void, ResetPasswordArgs>({
			query: email => ({
				url: '/users/reset_password/',
				method: 'POST',
				body: { email },
			}),
		}),
		resetPasswordConfirm: builder.mutation<void, ResetPasswordConfirmArgs>({
			query: ({ uid, token, new_password, re_new_password }) => ({
				url: '/users/reset_password_confirm/',
				method: 'POST',
				body: { uid, token, new_password, re_new_password },
			}),
		}),
	}),
});

export const {
	useRetrieveUserQuery,
	useGoogleAuthenticateMutation,
	useLoginMutation,
	useRegisterMutation,
	useVerifyMutation,
	useLogoutMutation,
	useActivationMutation,
	useResetPasswordMutation,
	useResetPasswordConfirmMutation,
} = authApiSlice;