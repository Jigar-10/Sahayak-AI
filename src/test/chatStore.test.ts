import { describe, expect, it, beforeEach, vi } from 'vitest'
import { useChatStore } from '@/store/chatStore'
import * as chatService from '@/services/chatService'

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.getState().clearChat()
  })

  it('initializes with closed state, welcome message, and 4 suggestions', () => {
    const state = useChatStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.unreadCount).toBe(0)
    expect(state.messages).toHaveLength(1)

    const welcomeMsg = state.messages[0]
    expect(welcomeMsg.role).toBe('assistant')
    expect(welcomeMsg.content).toContain("Hi! 👋 I'm EmoTrace.")
    expect(welcomeMsg.suggestions).toEqual([
      'I need help',
      'Emergency assistance',
      'How do I file a complaint?',
      'Track my complaint',
    ])
  })

  it('toggles open and closed states properly', () => {
    const { toggleChat, openChat, closeChat } = useChatStore.getState()

    toggleChat()
    expect(useChatStore.getState().isOpen).toBe(true)

    closeChat()
    expect(useChatStore.getState().isOpen).toBe(false)

    openChat()
    expect(useChatStore.getState().isOpen).toBe(true)
  })

  it('sends a user message and receives assistant reply', async () => {
    vi.spyOn(chatService, 'sendMessage').mockResolvedValueOnce({
      reply: 'Test assistant reply',
      suggestions: ['Next step'],
    })

    const { sendMessage } = useChatStore.getState()
    await sendMessage('Hello assistant')

    const state = useChatStore.getState()
    expect(state.messages).toHaveLength(3) // welcome + user + assistant
    expect(state.messages[1].role).toBe('user')
    expect(state.messages[1].content).toBe('Hello assistant')
    expect(state.messages[2].role).toBe('assistant')
    expect(state.messages[2].content).toBe('Test assistant reply')
    expect(state.isTyping).toBe(false)
  })

  it('increments unreadCount when message arrives while chat is closed', async () => {
    vi.spyOn(chatService, 'sendMessage').mockResolvedValueOnce({
      reply: 'Background notification',
    })

    useChatStore.setState({ isOpen: false, unreadCount: 0 })
    await useChatStore.getState().sendMessage('Ping')

    expect(useChatStore.getState().unreadCount).toBe(1)

    // Opening chat resets unread count
    useChatStore.getState().openChat()
    expect(useChatStore.getState().unreadCount).toBe(0)
  })

  it('handles error gracefully when service throws', async () => {
    vi.spyOn(chatService, 'sendMessage').mockRejectedValueOnce(new Error('Network error'))

    await useChatStore.getState().sendMessage('Test fail')

    const state = useChatStore.getState()
    const lastMsg = state.messages[state.messages.length - 1]
    expect(lastMsg.status).toBe('error')
    expect(lastMsg.content).toContain("Sorry, I couldn't process that right now.")
    expect(state.lastFailedInput).toBe('Test fail')
    expect(state.isTyping).toBe(false)
  })
})
