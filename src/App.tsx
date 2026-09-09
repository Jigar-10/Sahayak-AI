import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { OwnerRoute } from '@/components/layout/OwnerRoute'
import { Toast } from '@/components/ui/toast'
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
import { CaseDashboardPage } from '@/pages/CaseDashboardPage'
import { CaseListPage } from '@/pages/CaseListPage'
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
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/consent/decline" element={<ConsentDeclinePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/owner-login" element={<Navigate to="/login" replace />} />

            {/* Citizen Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-cases" element={<Navigate to="/profile" replace />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
            </Route>

            {/* Staff / Owner Protected Routes */}
            <Route element={<OwnerRoute />}>
              <Route path="/dashboard" element={<CaseDashboardPage />} />
              <Route path="/cases" element={<CaseListPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  )
}
