"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('admin')) {
            router.replace('/admin/login');
        }
    }, [router]);

    if (typeof window !== 'undefined' && !localStorage.getItem('admin')) {
        return null;
    }

    return children;
};

export default ProtectedRoute;