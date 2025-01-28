import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from '@/redux/features/authSlice';
import { useLoginMutation  } from '@/redux/features/authApiSlice';
import {toast} from 'react-toastify';



export default function useLogin() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login({ email, password })
        .unwrap()
        .then((data) => {
            dispatch(setAuth());
            toast.success('Login successful');
            router.push('/');
        })
        .catch((error) => {
            toast.error('Failed to login');
        });
    }

    return {
        email,
        password,
        isLoading,
        onChange,
        onSubmit
    };
}