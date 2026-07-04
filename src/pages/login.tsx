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
    <Layout title="Portal Sign In">
      {/* Hero Background */}
      <div className="relative bg-gradient-to-br from-rotary-blue to-rotary-dark-blue min-h-[80vh] flex items-center justify-center py-12 lg:py-24 overflow-hidden before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IiAyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIC8+PC9zdmc+') before:bg-[60px_60px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/3" />

        {/* Logo */}
        <div className="container mx-auto px-4 relative z-10 mb-8 animate-fade-in-down text-center">
          <Link href="/" className="inline-flex items-center space-x-2 group focus:outline-none focus:ring-4 focus:ring-yellow-500 rounded-lg p-2 hover:bg-white/5 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20 overflow-hidden">
              <Image src="/rotary-logo.png" alt="Rotary logo" width={64} height={64} className="h-full w-full object-contain" priority />
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="container mx-auto px-4 relative z-20 flex items-center justify-center">
          <div className="w-full max-w-md animate-fade-in-up [animation-delay:300ms]">
            <LoginForm onSubmit={handleSubmit} errorMessage={errorMessage} />

            <Link href="/" className="block w-full text-right mt-6 hover:text-yellow-500 transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default LoginPage;
