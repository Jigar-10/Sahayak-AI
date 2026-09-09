import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { OwnerProtectedRoute } from '@/components/layout/OwnerProtectedRoute'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Toast } from '@/components/ui/toast'

// Public & Citizen Pages
import { HomePage } from '@/pages/HomePage'
import { ConsentPage } from '@/pages/ConsentPage'
import { ConsentDeclinePage } from '@/pages/ConsentDeclinePage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { SupportPage } from '@/pages/SupportPage'
import { EmergencyPage } from '@/pages/EmergencyPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ApplyPage } from '@/pages/ApplyPage'
import { CaseDetailPage } from '@/pages/CaseDetailPage'

// Staff & Owner Pages
import { OwnerLoginPage } from '@/pages/OwnerLoginPage'
import { OwnerDashboardPage } from '@/pages/owner/OwnerDashboardPage'
import { OwnerCasesPage } from '@/pages/owner/OwnerCasesPage'
import { OwnerCaseDetailPage } from '@/pages/owner/OwnerCaseDetailPage'
import { OwnerEmergencyPage } from '@/pages/owner/OwnerEmergencyPage'
import { OwnerProfilePage } from '@/pages/owner/OwnerProfilePage'

import { useAuthStore } from '@/store/authStore'

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState({ message: '', visible: false })

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, duration } = (e as CustomEvent<{ message: string; duration: number }>).detail
      setToast({ message, visible: true })
      setTimeout(() => setToast({ message: '', visible: false }), duration)
    }
    window.addEventListener('app-toast', handler)
    return () => window.removeEventListener('app-toast', handler)
  }, [])

  return (
    <>
      {children}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ message: '', visible: false })}
      />
    </>
  )
}

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public & Citizen Routes (Wrapped in standard Citizen Layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/consent/decline" element={<ConsentDeclinePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/owner/login" element={<OwnerLoginPage />} />
            <Route path="/owner-login" element={<OwnerLoginPage />} />

            {/* Citizen Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-cases" element={<Navigate to="/profile" replace />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
            </Route>
          </Route>

          {/* Dedicated Staff / Owner Portal (Secured by OwnerProtectedRoute, themed by OwnerLayout) */}
          <Route element={<OwnerProtectedRoute />}>
            <Route element={<OwnerLayout />}>
              <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/owner/cases" element={<OwnerCasesPage />} />
              <Route path="/owner/cases/:id" element={<OwnerCaseDetailPage />} />
              <Route path="/owner/emergency-numbers" element={<OwnerEmergencyPage />} />
              <Route path="/owner/profile" element={<OwnerProfilePage />} />
              {/* Backward compatibility aliases */}
              <Route path="/dashboard" element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="/cases" element={<Navigate to="/owner/cases" replace />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
