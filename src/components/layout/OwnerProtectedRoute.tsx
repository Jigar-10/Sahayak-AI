import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

interface OwnerProtectedRouteProps {
  children?: React.ReactNode
}

export const OwnerProtectedRoute: React.FC<OwnerProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isOwner, isLoading, checkAuth, token } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (token && !isAuthenticated) {
      checkAuth()
    }
  }, [token, isAuthenticated, checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-slate-400 text-sm font-medium">Verifying Staff Authorization...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" state={{ from: location }} replace />
  }

  if (!isOwner) {
    // Normal citizen user attempting to access owner dashboard
    return <Navigate to="/profile" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
