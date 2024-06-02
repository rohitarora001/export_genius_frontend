'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext';
const Signout = () => {
    const { setUserLoggedIn } = useAuth();
    const router = useRouter()
    useEffect(() => {
        window.localStorage.clear()
        setUserLoggedIn(false)
        router.push('/auth/login')
    },[])
    return (
        <></>
    )
}

export default Signout