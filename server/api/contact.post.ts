import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  // CORS headers
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  // Handle preflight
  if (event.method === 'OPTIONS') {
    return { ok: true }
  }
  
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
    // Send email to site owner
    await transporter.sendMail({
      // from: `"${name}" <${email}>`,
      from: config.smtpFromAddress,
      replyTo: email,
      to: config.smtpFromAddress,
      subject: `Contact Form: ${subject}`,
      text: `From: ${name}`,
      html: `
 <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
   <div style="background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e0e0e0;">
     <h2 style="color: #333; margin: 0; font-size: 20px;">New Contact Form Submission</h2>
   </div>
   <div style="padding: 20px;">
     <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
     <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
     <p style="line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
   </div>
 </div>
`
    })

    // Send acknowledgement email to sender
    // This provides immediate feedback to the user that their message was received
    try {
      await transporter.sendMail({
        from: config.smtpFromAddress,
        to: email,
        subject: 'Thank you for your message',
        text: `Hi ${name},\n\nThank you for contacting me. I have received your message regarding "${subject}" and will get back to you within 24 hours.\n\nBest regards,\nSherwin Estrera`,
        html: `
 <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
   <div style="background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e0e0e0;">
     <h2 style="color: #333; margin: 0; font-size: 20px;">Thank you for your message</h2>
   </div>
   <div style="padding: 20px;">
     <p style="margin: 0 0 10px 0;">Hi ${name},</p>
     <p style="line-height: 1.6; margin: 0 0 10px 0;">Thank you for contacting me. I have received your message regarding "${subject}" and will get back to you within 24 hours.</p>
     <p style="margin: 0;">Best regards,<br>Sherwin Estrera</p>
   </div>
 </div>
`
      })
    } catch (ackError) {
      console.error('Acknowledgement email send error:', ackError)
      // Log error but don't fail the request since main email was sent successfully
      // This ensures the user still gets a success response even if acknowledgement fails
    }

    return { success: true, message: 'Thank you for your message! I\'ll get back to you within 24 hours.' }
  } catch (error) {
    console.error('Email send error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }
})