import { describe, expect, it, beforeAll } from 'vitest'
import { sendMessage } from '@/services/chatService'

describe('chatService', () => {
  beforeAll(() => {
    import.meta.env.VITE_USE_MOCK_CHAT = 'true'
  })
  it('returns emergency helplines for danger/emergency queries', async () => {
    const res = await sendMessage('I am in immediate danger, emergency!')
    expect(res.reply).toContain('112')
    expect(res.reply).toContain('181')
    expect(res.actionLink?.to).toBe('/emergency')
  })

  it('returns complaint filing instructions for grievance/report queries', async () => {
    const res = await sendMessage('How do I file a complaint?')
    expect(res.reply).toContain('Clear Consent First')
    expect(res.reply).toContain('Share Your Story')
    expect(res.actionLink?.to).toBe('/consent')
  })

  it('returns tracking guidance for case tracking queries', async () => {
    const res = await sendMessage('Track my complaint status')
    expect(res.reply).toContain('CASE-2026-')
    expect(res.actionLink?.to).toBe('/owner-login')
  })

  it('returns trauma-informed support for emotional help queries', async () => {
    const res = await sendMessage('I need help, feeling overwhelmed')
    expect(res.reply).toContain('courage')
    expect(res.actionLink?.to).toBe('/support')
  })
})
