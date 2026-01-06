import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestEvent, createTestApp } from '@nuxt/test-utils/runtime'
import chatHandler from '~/server/api/chat.post'

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 5,
            total_tokens: 15
          }
        })
      }
    }
  }))
}))

describe('POST /api/chat', () => {
  let app: any

  beforeEach(async () => {
    app = await createTestApp()
    vi.clearAllMocks()
  })

  it('should return a chat response for valid input', async () => {
    const event = createTestEvent({
      method: 'POST',
      body: {
        message: 'Hello',
        context: ['Previous message']
      }
    })

    const response = await chatHandler(event)

    expect(response).toHaveProperty('message', 'Test response')
    expect(response).toHaveProperty('usage')
    expect(response.usage).toHaveProperty('prompt_tokens', 10)
  })

  it('should return 400 for missing message', async () => {
    const event = createTestEvent({
      method: 'POST',
      body: {}
    })

    await expect(chatHandler(event)).rejects.toThrow('Message is required')
  })

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    const OpenAIMock = vi.mocked((await import('openai')).OpenAI)
    const mockInstance = {
      chat: {
        completions: {
          create: vi.fn().mockRejectedValue(new Error('API Error'))
        }
      }
    }
    OpenAIMock.mockImplementation(() => mockInstance as any)

    const event = createTestEvent({
      method: 'POST',
      body: {
        message: 'Test message'
      }
    })

    await expect(chatHandler(event)).rejects.toThrow('Failed to generate response')
  })
})