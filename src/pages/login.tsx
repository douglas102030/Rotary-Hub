import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (data: { username: string; password: string }) => {
    setErrorMessage('');

    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage('Invalid username or password.');
      return;
    }

    await router.push('/dashboard');
  };

  return (
    <Layout title="Portal Sign In - Rotary Ireland Hub">
      {/* Hero Background */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white min-h-[90vh] flex flex-col items-center justify-center py-12 lg:py-24 overflow-hidden">
        {/* Subtle Accent Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rotary-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rotary-blue/5 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="container mx-auto px-4 relative z-10 mb-12 animate-fade-in-down text-center">
          <Link href="/" className="inline-flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-rotary-gold rounded-full p-4 hover:bg-rotary-blue/5 transition-all duration-300">
            <Image 
              src="/rotary-logo-official.jpeg" 
              alt="Rotary Ireland Hub" 
              width={240} 
              height={100} 
              className="drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500 h-auto"
              priority
            />
          </Link>
          <p className="mt-6 text-lg text-rotary-blue font-medium">Connecting Clubs, Sharing Projects, Creating Impact</p>
        </div>

        {/* Login Card */}
        <div className="container mx-auto px-4 relative z-20 flex items-center justify-center mb-8">
          <div className="w-full max-w-md animate-fade-in-up [animation-delay:300ms]">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-rotary-gold/20">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-rotary-blue text-center">Sign In</h2>
                <p className="text-center text-gray-600 text-sm mt-2">Access your Rotary Ireland Hub account</p>
              </div>
              <LoginForm onSubmit={handleSubmit} errorMessage={errorMessage} />

              <Link href="/" className="block w-full text-center mt-6 text-gray-600 hover:text-rotary-gold transition-colors font-medium">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>

      </div>

    </Layout>
  );
};

export default LoginPage;
