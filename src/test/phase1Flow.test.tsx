import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ConsentPage } from '@/pages/ConsentPage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { useAssessmentStore } from '@/store/assessmentStore'

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

  it('completes consent and reaches assessment context step', async () => {
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
