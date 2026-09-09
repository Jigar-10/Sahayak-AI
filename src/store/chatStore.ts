import { create } from 'zustand'
import type { ChatMessage } from '@/types/chat'
import { sendMessage as sendChatMessage } from '@/services/chatService'

export const INITIAL_SUGGESTIONS = [
  'I need help',
  'Emergency assistance',
  'How do I file a complaint?',
  'Track my complaint',
]

const formatCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const createWelcomeMessage = (): ChatMessage => ({
  id: 'msg-welcome',
  role: 'assistant',
  content: "Hi! 👋 I'm Sahayak AI. How can I help you today?",
  timestamp: formatCurrentTime(),
  status: 'delivered',
  suggestions: INITIAL_SUGGESTIONS,
})

interface ChatStore {
  isOpen: boolean
  messages: ChatMessage[]
  currentInput: string
  isTyping: boolean
  unreadCount: number
  lastFailedInput: string | null

  // Actions
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  setCurrentInput: (input: string) => void
  sendMessage: (text?: string) => Promise<void>
  retryLastMessage: () => Promise<void>
  sendSuggestion: (text: string) => void
  clearChat: () => void
  markAsRead: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  messages: [createWelcomeMessage()],
  currentInput: '',
  isTyping: false,
  unreadCount: 0,
  lastFailedInput: null,

  openChat: () => {
    set({ isOpen: true, unreadCount: 0 })
  },

  closeChat: () => {
    set({ isOpen: false })
  },

  toggleChat: () => {
    const nextState = !get().isOpen
    set({
      isOpen: nextState,
      unreadCount: nextState ? 0 : get().unreadCount,
    })
  },

  setCurrentInput: (input: string) => {
    set({ currentInput: input })
  },

  markAsRead: () => {
    set({ unreadCount: 0 })
  },

  sendMessage: async (customText?: string) => {
    const textToSend = (customText ?? get().currentInput).trim()
    if (!textToSend || get().isTyping) return

    const userMsgId = `user-${Date.now()}`
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: formatCurrentTime(),
      status: 'delivered',
    }

    const currentHistory = get().messages

    // Optimistically append user message and clear current input
    set((state) => ({
      messages: [...state.messages, userMessage],
      currentInput: '',
      isTyping: true,
      lastFailedInput: null,
    }))

    try {
      const response = await sendChatMessage(textToSend, currentHistory)

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: formatCurrentTime(),
        status: 'delivered',
        suggestions: response.suggestions,
        actionLink: response.actionLink,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }))
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I couldn't process that right now. Please try again.",
        timestamp: formatCurrentTime(),
        status: 'error',
      }

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isTyping: false,
        lastFailedInput: textToSend,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }))
    }
  },

  retryLastMessage: async () => {
    const { lastFailedInput, sendMessage } = get()
    if (lastFailedInput) {
      await sendMessage(lastFailedInput)
    }
  },

  sendSuggestion: (text: string) => {
    get().sendMessage(text)
  },

  clearChat: () => {
    set({
      messages: [createWelcomeMessage()],
      currentInput: '',
      isTyping: false,
      unreadCount: 0,
      lastFailedInput: null,
    })
  },
}))
