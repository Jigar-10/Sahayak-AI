export type ChatMessageRole = 'user' | 'assistant' | 'system'

export type ChatMessageStatus = 'sending' | 'delivered' | 'error'

export interface ChatActionLink {
  label: string
  to: string
}

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  timestamp: string
  status: ChatMessageStatus
  suggestions?: string[]
  actionLink?: ChatActionLink
}

export interface QuickSuggestion {
  id: string
  label: string
  query: string
}

export interface ChatServiceResponse {
  reply: string
  suggestions?: string[]
  actionLink?: ChatActionLink
}
