import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const CURRENT_YEAR = 2026;

const HomePage: React.FC = () => {
  return (
    <Layout title="Rotary Club HUB Projects">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rotary-blue to-rotary-dark-blue text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '48px 48px'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rotary Club HUB Projects
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting clubs, sharing projects, and creating transformational impact in communities around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link 
                href="/pre-access"
                className="group inline-flex items-center px-8 py-4 bg-white text-rotary-blue font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0H3z" />
                </svg>
                Request Free Access
              </Link>

              <Link 
                href="/login"
                className="group inline-flex items-center px-8 py-4 bg-yellow-500 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6M7.5 21H9l3-6h8a3 3 0 013 3v3M21 12l-5 5 5 5V12z" />
                </svg>
                Access Existing Portal
              </Link>
            </div>

            <p className="text-gray-400 text-sm mt-6">Join more than {CURRENT_YEAR} Rotary members around the world</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-rotary-blue mb-4">
              Why use HUB Projects?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              A complete platform built especially for Rotary clubs to manage and share their impact projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Link 
              href="/projects"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Connecting Clubs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Build powerful connections between Rotary clubs in different regions, enabling collaboration and sharing best practices for social impact projects.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link 
              href="/projects"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Managed Projects
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create, track, and manage impact projects with integrated tools for photos, documents, and detailed reports.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link 
              href="/dashboard"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l9 2m8.7-3a6 6 0 00-11.27-.4c-.03.1-.05.2-.07.3A6.5 6.5 0 0111.9 2.5a6.48 6.48 0 00-5.7 9.5zM3 20h18M12 8V2m0 1v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Creating Real Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track project impact with metrics, reports, and community feedback to maximize social outcomes.
              </p>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Numbers That Speak for Us</h2>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { label: 'Active Clubs', value: '1,200+', icon: '🏛️' },
                { label: 'Projects Created', value: '3,500+', icon: '💼' },
                { label: 'Registered Members', value: '45,000+', icon: '👥' },
                { label: 'Communities Impacted', value: '890+', icon: '🌍' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <span className="text-5xl mb-4 block">{stat.icon}</span>
                  <p className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '64px 64px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to make a difference?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Start your Rotary project management journey today. Join our community and amplify your social impact with tools designed for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/pre-access"
                className="group inline-flex items-center px-8 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                Start Free Now
              </Link>

              <Link 
                href="/pre-access?mode=contact&source=hero"
                className="group inline-flex items-center px-8 py-5 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368hM21 12l-7.5-7.5L22.5 9" />
                </svg>
                Contact Support
              </Link>
            </div>

            <p className="text-gray-400 text-sm mt-6">Sem compromisso • Cancelamento a qualquer momento</p>
          </div>
        </div>
      </section>

      {/* Footer Previews */}
      <footer className="bg-blue-950 py-12 border-t border-white/10 relative z-10 -mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm mb-4">&copy; {CURRENT_YEAR} Rotary Club HUB Projects. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <a href="#" className="text-blue-400 hover:text-yellow-500 transition-colors">Terms of Use</a>
            <span className="hidden sm:inline-block px-3 border-r border-white/10">•</span>
            <a href="#" className="text-blue-400 hover:text-yellow-500 transition-colors">Privacy Policy</a>
            <span className="px-2 md:hidden text-gray-500">|</span>
            <a href="#" className="text-blue-400 hover:text-yellow-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </Layout>
  );
};

export default HomePage;
