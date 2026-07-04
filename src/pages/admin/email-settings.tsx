'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSession } from 'next-auth/react';
import Layout from '../../../components/Layout';

interface EmailConfig {
  id?: number;
  email_address: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  sender_name?: string;
  is_active?: boolean;
}

export default function EmailSettings() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [config, setConfig] = useState<EmailConfig>({
    email_address: '',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    sender_name: 'Rotary Club HUB'
  });

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchEmailConfig();
  }, [session]);

  const fetchEmailConfig = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      const data = await response.json();

      if (data.config) {
        setConfig({
          ...config,
          ...data.config,
          smtp_password: '' // Don't show password for security
        });
      }
    } catch (err) {
      console.error('Error fetching email config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'smtp_port' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!config.email_address || !config.smtp_host || !config.smtp_port || !config.smtp_user) {
      setError('Todos os campos são obrigatórios');
      setSaving(false);
      return;
    }

    // Get the SMTP password - if it's empty, user might be updating without changing it
    const smtpPassword = (document.querySelector('input[name="smtp_password"]') as HTMLInputElement)?.value;
    
    if (!smtpPassword && !config.id) {
      setError('Senha SMTP é obrigatória');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAddress: config.email_address,
          smtpHost: config.smtp_host,
          smtpPort: config.smtp_port,
          smtpUser: config.smtp_user,
          smtpPassword: smtpPassword || '',
          senderName: config.sender_name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao salvar configuração');
        return;
      }

      setSuccess(data.message);
      setTimeout(() => {
        fetchEmailConfig();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Erro ao salvar configuração de email');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-rotary-blue mb-8">Configuração de Email</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">
            Configure as credenciais de email que será usada para enviar notificações de senha esquecida, 
            confirmações de acesso e outros avisos importantes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email para Envio <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email_address"
                value={config.email_address}
                onChange={handleChange}
                placeholder="seu-email@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use seu email Gmail, Hotmail ou outro provedor SMTP
              </p>
            </div>

            {/* Sender Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do Remetente
              </label>
              <input
                type="text"
                name="sender_name"
                value={config.sender_name}
                onChange={handleChange}
                placeholder="Rotary Club HUB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SMTP Host */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Servidor SMTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="smtp_host"
                  value={config.smtp_host}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gmail: smtp.gmail.com | Hotmail: smtp-mail.outlook.com
                </p>
              </div>

              {/* SMTP Port */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Porta SMTP <span className="text-red-500">*</span>
                </label>
                <select
                  name="smtp_port"
                  value={config.smtp_port}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                >
                  <option value={587}>587 (TLS - Recomendado)</option>
                  <option value={465}>465 (SSL)</option>
                  <option value={25}>25 (SMTP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SMTP User */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuário/Email SMTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="smtp_user"
                  value={config.smtp_user}
                  onChange={handleChange}
                  placeholder="seu-email@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Geralmente é o mesmo email acima
                </p>
              </div>

              {/* SMTP Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha/App Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="smtp_password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gmail: use App Password | Hotmail: use sua senha
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-rotary-blue p-4 rounded">
              <p className="text-sm text-gray-700 font-semibold mb-2">Como configurar:</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>
                  <strong>Gmail:</strong> Ative 2FA, gere uma{' '}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rotary-blue hover:underline"
                  >
                    App Password
                  </a>
                  {' '}e use-a aqui
                </li>
                <li>
                  <strong>Hotmail/Outlook:</strong> Use seu email e senha, ou crie uma App Password
                </li>
                <li>
                  <strong>Outro SMTP:</strong> Configure com as credenciais fornecidas pelo provedor
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className={`w-full btn-primary py-3 font-semibold rounded-lg transition-all duration-300 ${
                saving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {saving ? 'Salvando...' : 'Salvar Configuração de Email'}
            </button>
          </form>
        </div>

        {/* Navigation to other admin pages */}
        <div className="mt-8 flex gap-4">
          <a
            href="/admin/users"
            className="px-4 py-2 text-rotary-blue hover:text-rotary-gold transition-colors"
          >
            ← Gerenciar Usuários
          </a>
          <a
            href="/admin/pre-access-requests"
            className="px-4 py-2 text-rotary-blue hover:text-rotary-gold transition-colors"
          >
            ← Solicitações de Acesso
          </a>
        </div>
      </div>
    </Layout>
  );
}
