import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { OwnerLoginPage } from '@/pages/OwnerLoginPage'
import { OwnerProtectedRoute } from '@/components/layout/OwnerProtectedRoute'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

vi.mock('@/services/authService', () => ({
  authService: {
    ownerLogin: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
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

describe('Owner Authentication & Route Protection Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      token: null,
      isOwner: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('renders OwnerLoginPage with official form controls and warning notice', () => {
    render(
      <MemoryRouter>
        <OwnerLoginPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Official Case Officer Login/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/officer@emotrace\.ai/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Authorize & Enter Console/i })).toBeDefined()
    expect(screen.getByText(/Unauthorized access attempts to this operational console/i)).toBeDefined()
  })

  it('submits owner credentials via ownerLogin and navigates on success', async () => {
    vi.mocked(authService.ownerLogin).mockResolvedValueOnce({
      token: 'valid-owner-jwt',
      type: 'Bearer',
      user: {
        id: 'owner-1',
        name: 'Sahayak Officer',
        email: 'owner@sahayak.ai',
        role: 'ROLE_OWNER',
        active: true,
      },
    })

    render(
      <MemoryRouter>
        <OwnerLoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/officer@emotrace\.ai/i), {
      target: { value: 'owner@sahayak.ai' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), {
      target: { value: 'Password@123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Authorize & Enter Console/i }))

    await waitFor(() => {
      expect(authService.ownerLogin).toHaveBeenCalledWith('owner@sahayak.ai', 'Password@123')
      expect(mockNavigate).toHaveBeenCalledWith('/owner/dashboard', { replace: true })
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.isOwner).toBe(true)
    expect(state.user?.email).toBe('owner@sahayak.ai')
  })

  it('displays error message when non-owner/citizen tries to login', async () => {
    vi.mocked(authService.ownerLogin).mockRejectedValueOnce(
      new Error('Unauthorized: Account does not have Owner privileges.')
    )

    render(
      <MemoryRouter>
        <OwnerLoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/officer@emotrace\.ai/i), {
      target: { value: 'citizen@sahayak.ai' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), {
      target: { value: 'Password@123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Authorize & Enter Console/i }))

    await waitFor(() => {
      expect(screen.getByText(/Unauthorized: Account does not have Owner privileges/i)).toBeDefined()
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isOwner).toBe(false)
  })

  it('OwnerProtectedRoute blocks unauthenticated access and redirects to /owner/login', () => {
    useAuthStore.setState({
      user: null,
      token: null,
      isOwner: false,
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/owner/dashboard']}>
        <Routes>
          <Route path="/owner/login" element={<div>Owner Login Page Target</div>} />
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<div>Secret Officer Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Secret Officer Dashboard')).toBeNull()
    expect(screen.getByText('Owner Login Page Target')).toBeDefined()
  })

  it('OwnerProtectedRoute blocks citizen user and redirects to /profile', () => {
    useAuthStore.setState({
      user: {
        id: 'citizen-1',
        name: 'Citizen User',
        email: 'citizen@test.com',
        role: 'ROLE_USER',
        active: true,
      },
      token: 'citizen-jwt-token',
      isOwner: false,
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/owner/dashboard']}>
        <Routes>
          <Route path="/profile" element={<div>Citizen Profile Target</div>} />
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<div>Secret Officer Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Secret Officer Dashboard')).toBeNull()
    expect(screen.getByText('Citizen Profile Target')).toBeDefined()
  })

  it('OwnerProtectedRoute permits verified ROLE_OWNER user', () => {
    useAuthStore.setState({
      user: {
        id: 'owner-1',
        name: 'Chief Officer',
        email: 'officer@sahayak.ai',
        role: 'ROLE_OWNER',
        active: true,
      },
      token: 'owner-jwt-token',
      isOwner: true,
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/owner/dashboard']}>
        <Routes>
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<div>Secret Officer Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Secret Officer Dashboard')).toBeDefined()
  })
})
