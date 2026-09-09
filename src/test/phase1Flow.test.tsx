import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ConsentPage } from '@/pages/ConsentPage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { useAssessmentStore } from '@/store/assessmentStore'
import { useAuthStore } from '@/store/authStore'

describe('Phase 1 flow', () => {
  it('renders home page with start assessment link', () => {
    render(
      <MemoryRouter>
        <Layout>
          <HomePage />
        </Layout>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /take safe screener/i })).toBeInTheDocument()
  })

  it('shows authentication wall on assessment page if user is not signed in', () => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/assessment']}>
        <Layout>
          <Routes>
            <Route path="/assessment" element={<AssessmentPage />} />
          </Routes>
        </Layout>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /sign in to access the assessment/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute(
      'href',
      '/register?redirect=/assessment',
    )
    const signinLinks = screen.getAllByRole('link', { name: /sign in/i })
    expect(signinLinks.some((link) => link.getAttribute('href') === '/login?redirect=/assessment')).toBe(true)
  })

  it('completes consent and reaches assessment context step when authenticated', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        name: 'John Citizen',
        email: 'john@example.com',
        role: 'ROLE_USER',
        active: true,
      },
      token: 'mock-token',
      isLoading: false,
    })

    useAssessmentStore.setState({
      consent: { purposeUnderstood: false, voluntaryConsent: false, notDiagnosis: false },
      step: 'context',
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/consent']}>
        <Layout>
          <Routes>
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
          </Routes>
        </Layout>
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText(/purpose of this assessment/i))
    await user.click(screen.getByLabelText(/voluntary consent/i))
    await user.click(screen.getByLabelText(/not a medical or psychological diagnosis/i))
    await user.click(screen.getByRole('button', { name: /continue to assessment/i }))

    expect(await screen.findByRole('heading', { name: /basic context/i })).toBeInTheDocument()
  })
})

