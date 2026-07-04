import nodemailer from 'nodemailer';
import { getDatebaseClient } from './database';

let transporter: any = null;

// Get email transporter (cached)
export async function getEmailTransporter() {
  if (transporter) return transporter;

  const db = getDatebaseClient();

  try {
    // Get email configuration from database
    const result = db.execute({
      sql: 'SELECT email_address, smtp_host, smtp_port, smtp_user, smtp_password, sender_name FROM email_config WHERE is_active = 1 LIMIT 1',
      args: []
    }) as any;

    if (!result.rows || result.rows.length === 0) {
      console.error('Email configuration not found');
      return null;
    }

    const config = result.rows[0] as any;

    transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: config.smtp_port === 465, // SSL for 465, TLS for 587
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password
      }
    });

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const transporter = await getEmailTransporter();

    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const db = getDatebaseClient();
    const configResult = db.execute({
      sql: 'SELECT email_address, sender_name FROM email_config WHERE is_active = 1 LIMIT 1',
      args: []
    }) as any;

    if (!configResult.rows || configResult.rows.length === 0) {
      console.error('Email configuration not found');
      return false;
    }

    const config = configResult.rows[0] as any;

    const mailOptions = {
      from: `${config.sender_name} <${config.email_address}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || undefined
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Reset transporter cache (call this after updating email config)
export function resetEmailTransporter() {
  transporter = null;
}

// Test email configuration
export async function testEmailConfiguration(emailAddress: string): Promise<{ success: boolean; message: string }> {
  try {
    const success = await sendEmail({
      to: emailAddress,
      subject: 'Teste de Configuração de Email - Rotary Club HUB',
      html: `
        <h2>Teste de Configuração</h2>
        <p>Parabéns! Sua configuração de email foi testada com sucesso.</p>
        <p>Este é um email de teste enviado pelo sistema Rotary Club HUB Projects.</p>
        <hr>
        <p><small>Data: ${new Date().toLocaleString('pt-BR')}</small></p>
      `,
      text: 'Email de teste - Configuração de email testada com sucesso!'
    });

    return {
      success,
      message: success
        ? 'Email de teste enviado com sucesso!'
        : 'Erro ao enviar email de teste'
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro ao testar email: ${error}`
    };
  }
}
