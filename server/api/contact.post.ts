import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, email, subject, message, recaptchaResponse } = body

  // Basic validation
  if (!name || !email || !subject || !message || !recaptchaResponse) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  }

  // Verify reCAPTCHA
  const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${config.recaptchaSecretKey}&response=${recaptchaResponse}`
  })
  const recaptchaResult = await recaptchaVerification.json()

  if (!recaptchaResult.success) {
    throw createError({ statusCode: 400, statusMessage: 'reCAPTCHA verification failed' })
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  })

  // Send mail
  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      replyTo: email,
      to: config.smtpFromAddress,
      subject: `Contact Form: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} <${email}></p><p>${message.replace(/\n/g, '<br>')}</p>`
    })

    return { success: true, message: 'Thank you for your message! I\'ll get back to you within 24 hours.' }
  } catch (error) {
    console.error('Email send error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }
})