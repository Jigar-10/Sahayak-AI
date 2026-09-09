import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage'
import { authService } from '@/services/authService'

vi.mock('@/services/authService', () => ({
  authService: {
    register: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('RegisterPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form fields and Create Account button', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Full Name/i)).toBeDefined()
    expect(screen.getByLabelText(/Official Email/i)).toBeDefined()
    expect(screen.getByLabelText(/Phone/i)).toBeDefined()
    expect(screen.getByLabelText(/^Password/i)).toBeDefined()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDefined()
  })

  it('validates password mismatch before calling the API', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/Official Email/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'Password@123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'DifferentPassword@123' } })

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeDefined()
    })
    expect(authService.register).not.toHaveBeenCalled()
  })

  it('displays duplicate email error from backend', async () => {
    vi.mocked(authService.register).mockRejectedValueOnce(
      new Error('An account with this email already exists.')
    )

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Duplicate User' } })
    fireEvent.change(screen.getByLabelText(/Official Email/i), { target: { value: 'duplicate@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'Password@123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password@123' } })

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(screen.getByText('An account with this email already exists.')).toBeDefined()
    })
  })

  it('displays temporary unavailable error only when service/network fails', async () => {
    vi.mocked(authService.register).mockRejectedValueOnce(
      new Error('Registration service is temporarily unavailable. Please try again.')
    )

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Offline User' } })
    fireEvent.change(screen.getByLabelText(/Official Email/i), { target: { value: 'offline@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'Password@123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password@123' } })

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(screen.getByText('Registration service is temporarily unavailable. Please try again.')).toBeDefined()
    })
  })

  it('submits valid data, calls API with exact payload, and redirects to /login', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      token: 'jwt-token-123',
      type: 'Bearer',
      user: {
        id: 'new-user-id',
        name: 'Anita Sharma',
        email: 'anita@example.com',
        phone: '9876543210',
        role: 'ROLE_USER',
        active: true,
      },
    })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Anita Sharma' } })
    fireEvent.change(screen.getByLabelText(/Official Email/i), { target: { value: 'anita@example.com' } })
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'Password@123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password@123' } })

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(
        'Anita Sharma',
        'anita@example.com',
        'Password@123',
        '9876543210',
        'Password@123',
        'USER',
      )
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })
  })
})
