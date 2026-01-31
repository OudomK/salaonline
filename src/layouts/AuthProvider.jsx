import { useHeartbeat, useMe } from '@/hooks/api'
import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthProvider = ({ children }) => {
    const { data } = useMe()
    const navigate = useNavigate()
    const location = useLocation()

    useHeartbeat()

    useEffect(() => {
        if (data && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login')) {
            navigate('/', { replace: true })
        }
    }, [data, location, navigate])

    return (
        <div>{children}</div>
    )
}

export default AuthProvider