import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestEvent, createTestApp } from '@nuxt/test-utils/runtime'
import contactHandler from '~/server/api/contact.post'

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn()
    }))
  }
}))

// Mock fetch for reCAPTCHA
global.fetch = vi.fn()

describe('POST /api/contact', () => {
  let app: any
  let transporterMock: any

  beforeEach(async () => {
    app = await createTestApp()
    transporterMock = {
      sendMail: vi.fn().mockResolvedValue({})
    }
    // Reset mocks
    vi.clearAllMocks()
  })

  it('should send both contact and acknowledgement emails on success', async () => {
    // Mock reCAPTCHA success
    (global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })

    // Mock transporter
    const nodemailer = await import('nodemailer')
    nodemailer.default.createTransport.mockReturnValue(transporterMock)

    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        recaptchaResponse: 'valid-response'
      }
    })

    const response = await contactHandler(event)

    expect(response).toEqual({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
    })

    // Should send two emails
    expect(transporterMock.sendMail).toHaveBeenCalledTimes(2)

    // First email: to site owner
    expect(transporterMock.sendMail).toHaveBeenNthCalledWith(1, {
      from: '"John Doe" <john@example.com>',
      replyTo: 'john@example.com',
      to: expect.any(String), // config.smtpFromAddress
      subject: 'Contact Form: Test Subject',
      text: 'From: John Doe <john@example.com>\n\nTest message',
      html: '<p><strong>From:</strong> John Doe <john@example.com></p><p>Test message</p>'
    })

    // Second email: acknowledgement to sender
    expect(transporterMock.sendMail).toHaveBeenNthCalledWith(2, {
      from: expect.any(String), // config.smtpFromAddress
      to: 'john@example.com',
      subject: 'Thank you for your message',
      text: 'Hi John Doe,\n\nThank you for contacting me. I have received your message regarding "Test Subject" and will get back to you within 24 hours.\n\nBest regards,\nSherwin Estrera',
      html: '<p>Hi John Doe,</p><p>Thank you for contacting me. I have received your message regarding "Test Subject" and will get back to you within 24 hours.</p><p>Best regards,<br>Sherwin Estrera</p>'
    })
  })

  it('should return success even if acknowledgement email fails', async () => {
    (global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })

    const nodemailer = await import('nodemailer')
    nodemailer.default.createTransport.mockReturnValue(transporterMock)

    // Make second email fail
    transporterMock.sendMail
      .mockResolvedValueOnce({}) // First email succeeds
      .mockRejectedValueOnce(new Error('SMTP error')) // Second email fails

    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        recaptchaResponse: 'valid-response'
      }
    })

    const response = await contactHandler(event)

    expect(response).toEqual({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
    })

    // Should still send both emails
    expect(transporterMock.sendMail).toHaveBeenCalledTimes(2)
  })

  it('should fail if main email fails', async () => {
    (global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })

    const nodemailer = await import('nodemailer')
    nodemailer.default.createTransport.mockReturnValue(transporterMock)

    // Make first email fail
    transporterMock.sendMail.mockRejectedValue(new Error('SMTP error'))

    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        recaptchaResponse: 'valid-response'
      }
    })

    await expect(contactHandler(event)).rejects.toThrow('Failed to send email')
  })

  it('should validate required fields', async () => {
    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        // missing message
        recaptchaResponse: 'valid-response'
      }
    })

    await expect(contactHandler(event)).rejects.toThrow('Missing required fields')
  })

  it('should validate email format', async () => {
    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message',
        recaptchaResponse: 'valid-response'
      }
    })

    await expect(contactHandler(event)).rejects.toThrow('Invalid email format')
  })

  it('should verify reCAPTCHA', async () => {
    (global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ success: false })
    })

    const event = createTestEvent({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        recaptchaResponse: 'invalid-response'
      }
    })

    await expect(contactHandler(event)).rejects.toThrow('reCAPTCHA verification failed')
  })
})