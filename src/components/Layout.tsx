import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const CURRENT_YEAR = 2026;

const Layout: React.FC<LayoutProps> = ({ children, title = 'Rotary Club HUB Projects' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Rotary Club HUB Projects Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-rotary-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="rotary-logo w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center">
              <Image src="/rotary-logo.png" alt="Rotary logo" width={40} height={40} className="h-full w-full object-contain" priority />
            </div>
            <h1 className="text-xl font-bold">Rotary Club HUB Projects</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-rotary-gold transition">Home</Link></li>
              <li><Link href="/projects" className="hover:text-rotary-gold transition">Projects</Link></li>
              <li><Link href="/dashboard" className="hover:text-rotary-gold transition">Dashboard</Link></li>
              {/*
              <li><Link href="/admin" className="hover:text-rotary-gold transition">Admin</Link></li>
              */}
            </ul>
          </nav>
          <div>
            <Link href="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-rotary-dark-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="rotary-logo w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center">
                  <Image src="/rotary-logo.png" alt="Rotary logo" width={32} height={32} className="h-full w-full object-contain" />
                </div>
                <span className="font-bold">Rotary Club HUB Projects</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">Connecting clubs, sharing projects, creating impact.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition">About</a>
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition">Contact</a>
              <a href="#" className="text-gray-300 hover:text-rotary-gold transition">Privacy</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>© {CURRENT_YEAR} Rotary Club HUB Projects. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
