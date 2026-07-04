import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LoginModal from './LoginModal';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const CURRENT_YEAR = 2026;

const Layout: React.FC<LayoutProps> = ({ children, title = 'Rotary Ireland Hub' }) => {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout...');
      const result = await signOut({ redirect: false });
      console.log('Logout resultado:', result);
      if (result) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Rotary Ireland Hub - Connecting Clubs, Sharing Projects, Creating Impact" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-rotary-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image 
              src="/rotary-logo-official.jpeg" 
              alt="Rotary Ireland Hub" 
              width={120} 
              height={38} 
              className="h-auto w-auto"
              priority
            />
          </Link>
          {session && (
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-rotary-gold transition">Home</Link></li>
                <li><Link href="/projects" className="hover:text-rotary-gold transition">Projects</Link></li>
                <li><Link href="/campaigns" className="hover:text-rotary-gold transition">Campaigns</Link></li>
                <li><Link href="/dashboard" className="hover:text-rotary-gold transition">Dashboard</Link></li>
                {session?.user?.role === 'admin' && (
                  <li><Link href="/admin" className="hover:text-rotary-gold transition font-bold">Admin</Link></li>
                )}
              </ul>
            </nav>
          )}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm font-medium">{session.user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-secondary"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-rotary-dark-blue text-white py-4 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-300">
              <p>© {CURRENT_YEAR} Rotary Club HUB Projects</p>
            </div>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition text-xs">About</a>
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition text-xs">Contact</a>
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition text-xs">Privacy</a>
            </div>
            <div className="text-gray-400 text-xs">
              <p>Created by <span className="text-rotary-gold font-medium">Douglas Ottolini</span> | <span className="text-rotary-gold font-medium">DNOB Tech</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
