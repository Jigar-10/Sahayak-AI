import type { ChatMessage, ChatServiceResponse } from '@/types/chat'
import { apiClient } from './apiClient'

interface ChatApiPayload {
  message: string
  history: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
}

/**
 * Clean service layer for AI Chatbot communications.
 * Integrates with Spring Boot + MongoDB backend at /api/chat via apiClient,
 * and falls back gracefully to local trauma-informed response engine if backend is offline.
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[] = [],
): Promise<ChatServiceResponse> {
  const useMockOnly = import.meta.env.VITE_USE_MOCK_CHAT === 'true'

  if (!useMockOnly) {
    try {
      const payload: ChatApiPayload = {
        message,
        history: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }

      const res = await apiClient.post<ChatServiceResponse>('/chat', payload)
      if (res && res.reply) {
        return {
          reply: res.reply,
          suggestions: res.suggestions,
          actionLink: res.actionLink,
        }
      }
    } catch {
      // In development / demo mode, fallback to local trauma-informed response engine
      if (import.meta.env.DEV) {
        console.warn('Backend /api/chat call failed, falling back to local trauma-informed response engine.')
        return generateMockResponse(message)
      }
      throw new Error("Sorry, I couldn't process that right now. Please try again.")
    }
  }

  // Local Trauma-Informed Response Engine (simulates realistic processing delay)
  return generateMockResponse(message)
}

/**
 * Intelligent domain-aware response generator tailored for Sahayak AI.
 */
async function generateMockResponse(userInput: string): Promise<ChatServiceResponse> {
  // Simulate natural AI thinking time (400ms - 800ms)
  await new Promise((resolve) => setTimeout(resolve, 600))

  const lower = userInput.trim().toLowerCase()

  // 1. Emergency Assistance & Immediate Danger
  if (
    lower.includes('emergency') ||
    lower.includes('danger') ||
    lower.includes('urgent') ||
    lower.includes('threat') ||
    lower.includes('police') ||
    lower.includes('ambulance') ||
    lower.includes('sos')
  ) {
    return {
      reply:
        "**If you are in immediate physical danger, please reach out to emergency services right away.**\n\n" +
        "• **112** — National Unified Emergency (Police, Fire, Medical)\n" +
        "• **181** — Women Helpline (24/7 Support & Safety)\n" +
        "• **1098** — Child Helpline (Child Protection & Care)\n" +
        "• **1930** — Cyber Crime Helpline\n" +
        "• **14566** — National Helpline Against Atrocities (SC/ST)\n\n" +
        "You can view complete verified contact numbers on our Emergency page.",
      suggestions: ['View emergency numbers', 'Start Safe Assessment', 'I need help'],
      actionLink: {
        label: 'Open Emergency Contacts',
        to: '/emergency',
      },
    }
  }

  // 2. Tracking a complaint / case status
  if (
    lower.includes('track') ||
    lower.includes('status') ||
    lower.includes('my case') ||
    lower.includes('check case') ||
    lower.includes('ticket')
  ) {
    return {
      reply:
        "When an assessment is completed and submitted for review, a unique identifier is generated (for example, **CASE-2026-00125**).\n\n" +
        "• If you have a case number, designated support officers can view progress in the case management system.\n" +
        "• Authorized officers can sign in using their credentials to manage and update active cases.\n\n" +
        "Need to check on a specific case or speak with a support specialist?",
      suggestions: ['How do I file a complaint?', 'Emergency assistance', 'I need help'],
      actionLink: {
        label: 'Case Worker Login',
        to: '/owner-login',
      },
    }
  }

  // 3. Filing a complaint / Starting an assessment
  if (
    lower.includes('file') ||
    lower.includes('complaint') ||
    lower.includes('start assessment') ||
    lower.includes('assessment') ||
    lower.includes('report') ||
    lower.includes('submit')
  ) {
    return {
      reply:
        "Filing a complaint or sharing your experience on EmoTrace is **completely safe, confidential, and voluntary**.\n\n" +
        "Here is how our 4-step process works:\n" +
        "1. **Clear Consent First** — You learn exactly how your data is handled before anything begins.\n" +
        "2. **Share Your Story** — Use text or voice, at your own pace, in your preferred language.\n" +
        "3. **AI Screening** — Our trauma-informed system assesses the situation to identify the right support pathway.\n" +
        "4. **Actionable Next Steps** — Receive personalized guidance, verified contacts, and option for human escalation.",
      suggestions: ['Start Safe Assessment', 'Is my data private?', 'Track my complaint'],
      actionLink: {
        label: 'Begin Safe Assessment',
        to: '/consent',
      },
    }
  }

  // 4. "I need help" / General distress & support
  if (
    lower.includes('need help') ||
    lower.includes('help me') ||
    lower.includes('sad') ||
    lower.includes('afraid') ||
    lower.includes('worried') ||
    lower.includes('anxious') ||
    lower.includes('scared') ||
    lower.includes('support')
  ) {
    return {
      reply:
        "Thank you for reaching out. It takes courage to seek support, and you are not alone.\n\n" +
        "EmoTrace is here to provide a calm, pressure-free space. Here are a few ways we can help right now:\n\n" +
        "• **Take the Safe Assessment**: Share what you are going through to receive tailored recommendations.\n" +
        "• **Emergency Resources**: Access 24/7 dedicated helplines for women, children, and urgent medical needs.\n" +
        "• **Ask me any questions**: I can help you understand your rights, available options, or support centers.\n\n" +
        "Take a breath — you can take this one step at a time.",
      suggestions: [
        'How do I file a complaint?',
        'Emergency assistance',
        'Is my data private?',
      ],
      actionLink: {
        label: 'Explore Support Resources',
        to: '/support',
      },
    }
  }

  // 5. Privacy & confidentiality questions
  if (
    lower.includes('privacy') ||
    lower.includes('private') ||
    lower.includes('confidential') ||
    lower.includes('safe') ||
    lower.includes('data')
  ) {
    return {
      reply:
        "**Privacy and safety are built into the core of EmoTrace:**\n\n" +
        "• **Confidential authentication** — Protects personal grievance data with user accounts.\n" +
        "• **Explicit consent** — We explain exactly what is captured before you type or speak.\n" +
        "• **Trauma-informed** — You are never forced to share anything you are uncomfortable sharing.\n" +
        "• **Safe quick exit** — Emergency options are always available at the top of every screen.",
      suggestions: ['Start Safe Assessment', 'Emergency assistance', 'I need help'],
      actionLink: {
        label: 'Review Consent Process',
        to: '/consent',
      },
    }
  }

  // 6. Greetings
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ')
  ) {
    return {
      reply:
        "Hello! 👋 I'm here to assist you with confidential support, filing a grievance, or finding emergency services.\n\n" +
        "How can I support you today?",
      suggestions: [
        'I need help',
        'Emergency assistance',
        'How do I file a complaint?',
        'Track my complaint',
      ],
    }
  }

  // Default thoughtful response
  return {
    reply:
      `I understand you're asking about "${userInput.slice(0, 80)}${userInput.length > 80 ? '...' : ''}".\n\n` +
      "EmoTrace is designed to help you navigate challenging situations with clear, trauma-informed guidance. " +
      "You can start a confidential assessment, browse emergency contacts, or ask me for specific instructions.",
    suggestions: [
      'I need help',
      'Emergency assistance',
      'How do I file a complaint?',
      'Track my complaint',
    ],
  }
}
