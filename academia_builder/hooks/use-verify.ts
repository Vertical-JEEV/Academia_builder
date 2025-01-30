import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';
import { useVerifyMutation } from '@/redux/features/authApiSlice';

export default function useVerify() {
    const dispatch = useAppDispatch();
    const [verify] = useVerifyMutation();
    console.log('useVerify triggered');
    useEffect(() => {
        console.log('useEffect triggered');
        verify(undefined)
            .unwrap()
            .then((data) => {
                dispatch(setAuth());
                //setResult(data);
            })
            .finally(() => {
                console.log('finishInitialLoad');
                dispatch(finishInitialLoad());
            });
    }, []);

    
}