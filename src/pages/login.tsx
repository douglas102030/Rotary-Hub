import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Se já estiver logado, redirecionar para dashboard
    if (session) {
      router.push('/dashboard');
    } else {
      // Se não estiver logado, redirecionar para home (onde o modal pode ser usado)
      router.push('/');
    }
  }, [session, router]);

  return (
    <Layout title="Redirecting...">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
