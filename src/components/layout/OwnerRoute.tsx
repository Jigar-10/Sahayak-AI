import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function OwnerRoute() {
  const isOwner = useAuthStore((state) => state.isOwner)
  const location = useLocation()

  if (!isOwner) {
    return <Navigate to="/owner-login" replace state={{ from: location }} />
  }

  return <Outlet />
}
