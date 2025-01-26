
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import {toast} from 'react-toastify';




export default function useRegister() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const [formData, setFormData] = useState({
        first_name: '', 
        last_name: '',
        email: '',
        account_type: '',
        password: '',
        re_password: '',
    });

    const { first_name, last_name, email, account_type, password, re_password } = formData;

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        register({ first_name, last_name, email, account_type, password, re_password })
        .unwrap()
        .then((data) => {
            toast.success('Please check your email to verify your account');
            router.push('/auth/login');
    })
    .catch((error) => {
        toast.error('Failed to register account');
    });
    }

    return {
        first_name, 
        last_name, 
        email, 
        account_type, 
        password, 
        re_password, 
        isLoading, 
        onChange, 
        onSubmit 
    };
}

    

