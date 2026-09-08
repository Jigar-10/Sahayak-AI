import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { OwnerRoute } from '@/components/layout/OwnerRoute'
import { Toast } from '@/components/ui/toast'
import { HomePage } from '@/pages/HomePage'
import { ConsentPage } from '@/pages/ConsentPage'
import { ConsentDeclinePage } from '@/pages/ConsentDeclinePage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { SupportPage } from '@/pages/SupportPage'
import { EmergencyPage } from '@/pages/EmergencyPage'
import { CaseDashboardPage } from '@/pages/CaseDashboardPage'
import { CaseListPage } from '@/pages/CaseListPage'
import { CaseDetailPage } from '@/pages/CaseDetailPage'
import { OwnerLoginPage } from '@/pages/OwnerLoginPage'

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
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/consent/decline" element={<ConsentDeclinePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/owner-login" element={<OwnerLoginPage />} />

            <Route element={<OwnerRoute />}>
              <Route path="/dashboard" element={<CaseDashboardPage />} />
              <Route path="/cases" element={<CaseListPage />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
            </Route>
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  )
}
